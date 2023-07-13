import { getEntries, safeAdd } from "../../helper-funcs.js";

el.GAUNTLET_MSG = {
    RANK_CHANGED: 0,
    ROUND_STARTED: 1,
    LEVEL_CHANGED: 2,
    EXP_CHANGED: 3,
    UPGRADE_PURCHASED: 4,
}

el.GAUNTLET_RANKS = [
    {
        rankLabel: "D",
        pointMultiplier: 1,
        expMultiplier: 1,
        penaltyMultiplier: 0.75
    }, {
        rankLabel: "C",
        pointMultiplier: 1.25,
        expMultiplier: 1.1,
        penaltyMultiplier: 1
    }, {
        rankLabel: "B",
        pointMultiplier: 1.5,
        expMultiplier: 1.2,
        penaltyMultiplier: 1.25
    }, {
        rankLabel: "A",
        pointMultiplier: 2,
        expMultiplier: 1.35,
        penaltyMultiplier: 1.5
    }, {
        rankLabel: "S",
        pointMultiplier: 3,
        expMultiplier: 1.5,
        penaltyMultiplier: 2
    },
]

function compileSteps(steps: el.GauntletStepBase.Settings[], cup: el.GauntletCup): [el.GauntletStep[], number] {
    let numRounds = 0;
    let roundSteps = [];
    let prevStep: Optional<el.GauntletStep> = undefined;
    for(const settings of steps) {
        //@ts-expect-error does not like me calling this
        let step: el.GauntletStep = new el.GAUNTLET_STEP[settings.type](settings);
        if(step.isProperRound) numRounds++;
        
        step.cup = cup;

        if(prevStep) prevStep.next = step;
        prevStep = step;

        roundSteps.push(step);
    }

    return [roundSteps, numRounds]
}

function generateFoodEntry(key: string, entry: el.GauntletCup.FoodItemEntry): el.GauntletController.BonusOption {
    let item = sc.inventory.getItem(entry.id)!;
    return {
        type: "item",
        weight: entry.weight,
        cost: entry.cost,
        name: "sc.gui.el-gauntlet.bonuses.genericName." + (entry.count! > 1 ? "itemBuyNumber" : "itemBuy"),
        nameReplace: [
            {
                original: "[NAME]",
                replacement: `\\v[item.${entry.id}.name]`
            },
            {
                original: "[COUNT]",
                replacement: entry.count || 1
            }
        ],
        shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.item",
        descReplace: [
            {
                original: "[NAME]",
                replacement: `\\v[item.${entry.id}.name]`
            },
            {
                original: "[COUNT]",
                replacement: entry.count || 1
            }
        ],
        key,
        iconSrc: "",
        icon: new el.GauntletFoodIcon(item.foodSprite || "SANDWICH"),
        iconIndexX: 0,
        iconIndexY: 0,
        itemID: entry.id,
        value: entry.count || 1,
        repeat: true,
    }
}

el.GauntletCup = ig.JsonLoadable.extend({
    enemyTypes: null,
    cacheType: "EL_GAUNTLET_CUP",
    debugReload: true,
    bonusOptions: {},

    getJsonPath() {
        return `${ig.root}${this.path.toPath("data/el-gauntlet/", ".json")}`
    },

    onload(data) {
        this.data = data;
        this.name = ig.LangLabel.getText(this.data.name);
        this.desc = ig.LangLabel.getText(this.data.description);
        this.condition = new ig.VarCondition(data.condition);

        this.map = data.map;
        this.marker = data.marker;

        this.statIncrease = data.statIncrease;

        this.enemyTypes = {};
        for(let [name, type] of Object.entries(data.enemyTypes)) {
            let statChange = new sc.StatChange([]);
            statChange.update = () => false;
            
            if(type.buff) {
                for(let param in type.buff) {
                    //@ts-ignore - can't be bothered to deal with typing
                    statChange.params[param] = type.buff[param];
                }
            }

            let effect: Optional<ig.EffectHandle>;
            if(type.effect) {
                effect = new ig.EffectHandle(type.effect);
            }
            
            this.enemyTypes[name] = {
                enemyInfo: new sc.EnemyInfo(type.settings),
                xp: type.xp,

                levelOffset: type.levelOffset || 0,
                pointMultiplier: type.pointMultiplier || 1,

                buff: statChange,
                effect,
            }
        }

        this.functions = {};
        if(data.functions) for(let [name, func] of Object.entries(data.functions)) {
            let [stepList, stepCount] = compileSteps(func.steps, this)
            
            if (stepCount > 0) console.error("Warning: Gauntlet functions are not supposed to have round-based steps!")

            this.functions[name] = new el.GauntletFunction(stepList)
        }
        
        [this.roundSteps, this.numRounds] = compileSteps(data.roundSteps, this);
        
        //this.rounds = data.rounds;
        this.playerStats = data.playerStats;

        const defaultOptions = el.GauntletCup.DefaultBonusOptions;

        let bonusOptions: Record<string, el.GauntletCup.BonusEntry> = {}

        if(data.defaultBonusSets) for(let set of data.defaultBonusSets) {
            if(set in defaultOptions) {
                Object.assign(bonusOptions, defaultOptions[set]);
            } else {
                console.error(`Cup parsing error: Could not find set ${set} in default options for cup ${this.name}!`);
            }
        }

        for(let [key, value] of getEntries(bonusOptions)) {
            this.bonusOptions[key] = {
                ...value,
                key: key,
                icon: new ig.Image(value.iconSrc),
                condition: new ig.VarCondition(value.condition || "true"),
                type: value.type,
            }
        }

        if(data.foodItemShopEntries) for(let entry of data.foodItemShopEntries) {
            let key = `ITEM_BUY_${entry.id}__COUNT_${entry.count || 1}`;

            this.bonusOptions[key] = generateFoodEntry(key, entry);
        }

    },

    getName() {
        return this.name;
    }
})


const DEFAULT_CUPS = ["test-gauntlet"];

function createRankBox(entity: ig.Entity) {
    return new sc.SmallEntityBox(entity, `${ig.lang.get("sc.gui.combat-msg.rank-up")} ${el.gauntlet.getRankLabel()}`, 2);
}


el.GauntletController = ig.GameAddon.extend({
    runtime: null,
    active: false,
    cups: {},
    partyStash: [],
    storedPartyBehavior: "OFFENSIVE",

    observers: [],

    categoryColorCodes: {
        statUp: "\\C[green]",
        statLevelUp: "\\C[green]",
        modifier: "\\C[yellow]",
        addPartyMember: "\\C[purple]",
        heal: "\\C[blue]",
        item: "\\C[orange]",
        special: "\\C[pink]"
    },
    numBonusOptions: 4,
    foodIconSprites: null,

    init() {
        this.parent("el-Gauntlet");
        this.registerCup(DEFAULT_CUPS);
        ig.vars.registerVarAccessor("gauntlet", this);
        this.levelUpGui = new el.GauntletLevelUpGui(this.numBonusOptions);
        this.bonusEvent = new ig.Event({
            name: "GauntletLevelUp",
            steps: [{
                type: "SHOW_GAUNTLET_LEVEL_UP",
            }]
        })
    },

    onPostUpdate() {
        const runtime = this.runtime;
        if(this.active && !ig.loading && !ig.game.paused) {
            if(runtime.combatRankTimer <= 0) {
                this.addRank(-ig.system.tick * 5, false);
            } else {
                runtime.combatRankTimer -= ig.system.tick;
            }

            let callstack = runtime.steps.callstack;

            if(runtime.gauntletStarted) {
                //will run through all valid rounds it can
                while(callstack.length > 0 && !this.pauseExecution) {
                    let lastStep = callstack.last();
                    if(lastStep.canAdvanceRound()) {
                        let [nextStep, branchStep] = lastStep.nextStep();

                        if(nextStep) callstack[callstack.length-1] = nextStep;
                        else callstack.pop();
                        
                        if(branchStep) callstack.push(branchStep);

                        if(callstack.length > 0) {
                            if(lastStep.isProperRound) this.showBonusGui();
                            else this.startNextRound();
                        }
                    } else break;
                }
    
                if(callstack.length === 0) {
                    // end the cup! 
                }
            }
        }
    },

    onLevelLoaded() {
        if(this.active) {
            sc.commonEvents.startCallEvent("el-gauntlet-start-cup");
            this.runtime.steps.callstack.push(this.runtime.currentCup!.roundSteps[0]);
        }
    },
    
    //#region utility
    registerCup(cupName) {
        if(Array.isArray(cupName)) {
            for(const name of cupName) {
                this.registerCup(name);
            }
        } else {
            if(cupName in this.cups) {
                console.warn(`Gauntlet: Attempt to register cup with duplicate name "${cupName}" detected!`);
                return;
            }

            this.cups[cupName] = new el.GauntletCup(cupName);
        }
    },

    enterGauntletMode(name) {
        this.active = true;

        sc.model.setMobilityBlock("CHECKPOINT")
        sc.model.player.setCore(sc.PLAYER_CORE.CREDITS, false);
        sc.model.player.setCore(sc.PLAYER_CORE.EXP, false);
        sc.model.player.setCore(sc.PLAYER_CORE.ITEMS, false);

        sc.timers.removeTimer("gauntletTimer")

        let cup = this.cups[name];
        let runtime: typeof this.runtime = this.runtime = {
            currentCup: cup,
            curPoints: 0,
            totalPoints: 0,
            curXp: 0,
            curLevel: 1,
            currentRound: 0,
            roundEnemiesDefeated: 0,
            roundEnemiesGoal: 0,
            steps: {
                callstack: []
            },
            gauntletStarted: false,
            statIncrease: {
                hp: 0,
                attack: 0,
                defense: 0,
                focus: 0,
            },
            inventory: {},
        
            combatRankLevel: 0,
            combatRankProgress: 0,
            combatRankTimer: 0,
        
            playerStatOverride: undefined,
            levelDiff: 0,
            selectedBonuses: {},
            partySelected: 0,
        };
        
        runtime.currentCup = cup;

        runtime.playerStatOverride = new el.StatOverride(cup.playerStats);
        runtime.playerStatOverride.addModel(sc.model.player);
        
        runtime.statIncrease = {...cup.statIncrease}

        this.storedPartyBehavior = sc.party.strategyKeys.BEHAVIOUR;
        this.stashPartyMembers();
        this.pauseExecution = false;

        ig.game.teleport(cup.map, cup.marker ? new ig.TeleportPosition(cup.marker) : null)
    },

    beginGauntlet() {
        if(this.active) {
            this.runtime.gauntletStarted = true;
            this.startTimer();
            this.addGui();
        }
    },

    startNextRound() {
        const runtime = this.runtime;
        //let cup = runtime.currentCup!;
        
        runtime.gauntletStarted = true;
        runtime.roundEnemiesDefeated = 0;
        let step = runtime.steps.callstack.last()!;


        if(step.isProperRound) runtime.currentRound++;
        if(step) {
            step.start(runtime);
        } else {
            console.warn("Tried to start next round when there was no round to start!")
        }
        
        sc.Model.notifyObserver(this, el.GAUNTLET_MSG.ROUND_STARTED);
    },

    addGui() {
        if(this.roundGui) {
            this.roundGui.remove();
            ig.gui.freeEventGui(this.roundGui);
        }
        if(this.scoreGui) {
            this.scoreGui.remove();
            ig.gui.freeEventGui(this.scoreGui);
        }
        this.roundGui = ig.gui.createEventGui("round", "ScoreHud", {
            taskTitle: ig.lang.get("sc.gui.el-gauntlet.round"),
            maxValue: 999999999,
            time: 0.2,
            useDots: true,
            variable: "gauntlet.round",
            cutsceneOkay: true
        });
        ig.gui.spawnEventGui(this.roundGui!);

        this.scoreGui = ig.gui.createEventGui("points", "ScoreHud", {
            taskTitle: ig.lang.get("sc.gui.el-gauntlet.points"),
            maxValue: 999999999,
            time: 0.2,
            useDots: true,
            variable: "gauntlet.points",
            cutsceneOkay: true
        });
        ig.gui.spawnEventGui(this.scoreGui!);
    },

    stashPartyMembers() {
        this.partyStash.length = 0;

        this.partyStash = [...sc.party.currentParty];
        for(let member of this.partyStash) {
            sc.party.removePartyMember(member, undefined, true);
        }
    },
    unstashPartyMembers() {
        for(let member of this.partyStash) {
            sc.party.addPartyMember(member, null, false, true);
        }
        this.partyStash.length = 0;
    },

    onVarAccess(_path, keys) {
        const runtime = this.runtime;
        const cup = runtime.currentCup!;
        if(keys[0] === "gauntlet") {
            switch(keys[1]) {
                case "active":
                    return this.active;
                case "points":
                    return this.active ? Math.round(runtime.curPoints) : 0;
                case "round":
                    return this.active ? runtime.currentRound : undefined;
                case "bonus":
                    if(!this.active) return;
                    const bonusKey = keys[2];
                    if(!bonusKey || !(bonusKey in cup.bonusOptions)) return;
                    const bonus = cup.bonusOptions[bonusKey];
                    switch(keys[3]) {
                        case "count":
                            return runtime.selectedBonuses[bonusKey] || 0;
                        case "name":
                            return this.getBonusOptionName(bonus);
                        case "cost":
                            return this.getBonusOptionCost(bonus);
                    }
                    break;
            }
        }
    },

    spawnEnemy(enemyEntry, baseLevel, showEffects = true) {
        let {type, pos: marker} = enemyEntry;
        let enemyType = this._getEnemyType(type);
        let {enemyInfo, buff, levelOffset, effect} = enemyType;
        let pos = {...ig.game.getEntityByName(marker.marker).coll.pos};

        pos.x += marker.offX || 0;
        pos.y += marker.offY || 0;
        pos.z += marker.offZ || 0;

        let entity = ig.game.spawnEntity(
            ig.ENTITY.Enemy,
            pos.x, pos.y, pos.z,
            {enemyInfo: enemyInfo.getSettings()},
            showEffects
        );
        entity.setLevelOverride(baseLevel + levelOffset);
        entity.setTarget(ig.game.playerEntity, true)

        entity.el_gauntletEnemyInfo = enemyType;
        if(buff) {
            entity.params.addBuff(buff);
        }
        if(effect) {
            effect.spawnOnTarget(entity, {
                align: "CENTER",
                duration: -1,
                group: "gauntlet_fx"
            })
        }

        return entity;
    },

    _getEnemyType(enemyType) {
        return this.runtime.currentCup!.enemyTypes[enemyType]
    },

    getRoundEnemiesDefeated() {
        return this.active ? this.runtime!.roundEnemiesDefeated : 0;
    },

    addPartyMember(member) {
        if(!this.active) return;

        if(sc.PARTY_OPTIONS.includes(member)) {
            sc.party.addPartyMember(member, null, null, false, true);
            let model = sc.party.models[member];
            model.setTemporary(false);
            this.runtime.playerStatOverride!.addModel(model);
        } else {
            console.error(`Warning: ${member} not found in sc.PARTY_OPTIONS!`)
        }
    },
    //#endregion

    //#region Points
    onCombatantDeathHit(attacker, victim) {
        if(this.active) {
            if(victim instanceof ig.ENTITY.Enemy) {
                this.addPoints(victim.getLevel() * 10 * victim.el_gauntletEnemyInfo!.pointMultiplier);
                this.runtime.roundEnemiesDefeated++;
                if(this.addRank(10 * victim.enemyType.enduranceScale)) {
                    ig.gui.addGuiElement(createRankBox(victim))
                }

                this.addExp(victim.el_gauntletEnemyInfo.xp);
            }
        }
    },
    onGuardCounter(enemy) {
        if(this.active) {
            this.addRank(5);
        }
    },
    onEnemyBreak(enemy) {
        if(this.active) {
            this.addRank(5);
        }
    },
    onEnemyDamage(combatant, damageResult) {
        if(!this.active) return;

        let damageVal = Math.min(combatant.params.currentHp, damageResult.damage);
        let rankVal = damageVal / combatant.params.getStat('hp');
        rankVal *= 10;
        rankVal *= damageResult.defensiveFactor;
        if (this.addRank(rankVal)) {
            ig.gui.addGuiElement(createRankBox(combatant));
        }
    },
    onPlayerDamage(combatant, damageResult, shieldResult) {
        if(!this.active) return;

        if(shieldResult === sc.SHIELD_RESULT.PERFECT) {
            if(this.addRank(0.5)) {
                ig.gui.addGuiElement(createRankBox(ig.game.playerEntity));
            }
        } else {
            this.addRank(-20 * (damageResult.damage / combatant.params.getStat("hp")) * this.getRankPenalty());
        }
    },

    addPoints(score) {
        if(this.active) {
            let points = score * this.getRankPointMultiplier();
            this.runtime.curPoints += points;
            this.runtime.totalPoints += points;
            ig.game.varsChangedDeferred();
        }
    },
    //#endregion

    //#region exp/levels
    addExp(exp) {
        let runtime = this.runtime;

        let exp_gain = Math.round(exp * this.getRankExpMultiplier());
        runtime.curXp += exp_gain;
        if(this.processLevel()) {
            new sc.SmallEntityBox(ig.game.playerEntity, ig.lang.get("sc.gui.el-gauntlet.level-up"), 2);
        }

        sc.Model.notifyObserver(this, el.GAUNTLET_MSG.EXP_CHANGED, exp_gain)
        // if(runtime.curXp >= 1000) {
        //     runtime.curLevel += Math.floor(runtime.curXp / 1000);
        //     runtime.curXp %= 1000;
        //     sc.Model.notifyObserver(this, el.GAUNTLET_MSG.LEVEL_CHANGED);
        // }
    },

    processLevel() {
        let runtime = this.runtime;
        if(this.active && runtime.curXp >= 1000) {
            runtime.levelDiff = Math.floor(runtime.curXp / 1000);

            runtime.playerStatOverride!.updateStats(runtime.statIncrease, "add", runtime.levelDiff);
            
            runtime.curLevel += runtime.levelDiff;
            runtime.curXp %= 1000;

            sc.Model.notifyObserver(this, el.GAUNTLET_MSG.LEVEL_CHANGED);
            return true;
        }
        return false;
    },
    pauseTimer() {
        sc.timers.stopTimer("gauntletTimer")
    },
    startTimer() {
        if(sc.timers.timers.gauntletTimer) {
            sc.timers.resumeTimer("gauntletTimer")
        } else {
            sc.timers.addTimer(
                "gauntletTimer",
                sc.TIMER_TYPES.COUNTER,
                null, null, null, true, true, null,
                ig.lang.get("sc.gui.arena.time"),
                true
            );
        }
    },

    applyLevelUpBonus(opt) {
        const runtime = this.runtime;
        //we will assume that the option will have all that's needed for a type.
        //beats having to type ! after everything.
        let option = opt as Required<typeof opt>;
        if(!this.active) return;

        if(option.key in runtime.selectedBonuses) {
            runtime.selectedBonuses[option.key]++;
        } else {
            runtime.selectedBonuses[option.key] = 1
        }
        
        const statOverride = runtime.playerStatOverride!;
        switch(option.type) {
        case "statUp":
            if(option.statType === "maxSp") {
                statOverride.addSp(option.value);
            } else {
                let stat = option.statType as keyof el.StatOverride.ElementBonus;
                if(option.absolute) {
                    statOverride.updateStats({[option.statType]: option.value}, "add");
                } else {
                    if(option.element && option.element !== "ALL") {
                        let bonus = statOverride.elementBonus[option.element];
                        bonus[stat] += option.value - 1;
                        statOverride._updateModifications()
                    } else {
                        statOverride.updateStats({[option.statType]: option.value}, "mul");
                    }
                }
            }
            break;
        case "modifier":
            if(option.element && option.element !== "ALL") {
                let element = statOverride.elementBonus[option.element];
                safeAdd(element.modifiers, option.statType, option.value);
                statOverride._updateModifications();
            } else {
                statOverride.updateStats({[option.statType]: option.value}, "add");                
            }
            break;
        case "statLevelUp":
            runtime.statIncrease[option.statType as keyof el.StatOverride.StatModification] += option.value;
            break;
        case "addPartyMember":
            this.addPartyMember(option.partyMemberName);
            runtime.partySelected++;
            break;
        case "heal":
            ig.game.playerEntity.heal({value: option.value});
            break;
        case "item": 
            safeAdd(runtime.inventory, option.itemID, option.value);
            break;
        case "special":
            if(option.specialFunc in el.GAUNTLET_SPECIAL_BONUS_FUNC) {
                el.GAUNTLET_SPECIAL_BONUS_FUNC[option.specialFunc](option.specialFuncParams, option, runtime);
            } else {
                console.error(`Warning: Function for ${option.specialFunc} not found in el.GAUNTLET_SPECIAL_BONUS_FUNC.`)
            }
            break;
        }
    },

    getBonusOptionCost(option) {
        const runtime = this.runtime;
        //TODO: Apply cost scaling.
        switch(option.costScaleType) {
            case "LINEAR":
                return option.cost + option.costScaleFactor! * (runtime.selectedBonuses[option.key] || 0);
            case "PARTY":
                return option.cost * (2 ** runtime.partySelected);
        }
        
        return option.cost;
    },
    getBonusOptionWeight(option) {
        const runtime = this.runtime;
        const bonusesPicked = runtime.selectedBonuses;
        switch(option.weightScaleType) {
            case "EXPONENTIAL":
                return option.weight * option.weightScaleFactor! ** (bonusesPicked[option.key] || 0);
            case "PARTY":
                return option.weight * 0.75 ** runtime.partySelected;
            default:
                return option.weight;
        }
    },
    getBonusOptionName(option, useElementColors) {
        function elemToColorCode(element: keyof typeof sc.ELEMENT) {
            if(useElementColors) switch(element) {
                case "NEUTRAL": return "\\C[gray]";
                case "HEAT": return "\\C[red]";
                case "COLD": return "\\C[blue]";
                case "SHOCK": return "\\C[purple]";
                case "WAVE": return "\\C[lime]";
            }
        }

        let name = "";
        if(option.name) {
            if(typeof option.name == "string") {
                name = ig.lang.get(option.name);
            } else {
                name = ig.LangLabel.getText(option.name);
            }
        } else name = ig.lang.get(`sc.gui.el-gauntlet.bonuses.options.${option.key}.name`);

        

        if(option.nameReplace) for(let replacer of option.nameReplace) {
            name = name.replace(replacer.original, replacer.replacement!.toString());
        }


        if(option.element && option.element !== "ALL") {
            name += " " + elemToColorCode(option.element) + ig.lang.get("sc.gui.el-gauntlet.bonuses.elementSuffix." + option.element);
        }

        return name;
    },
    getBonusOptionDesc(option) {
        if(option.shortDesc) {
            if(typeof option.shortDesc == "string") {
                let text = ig.lang.get(option.shortDesc);
                if(option.descReplace) {
                    for(let replacer of option.descReplace) {
                        text = text.replace(replacer.original, replacer.replacement!.toString());
                    }
                }
                return text;
            } else {
                return ig.LangLabel.getText(option.shortDesc);
            }
        }
        return ig.lang.get(`sc.gui.el-gauntlet.bonuses.options.${option.key}.shortDesc`);
    },
    getBonusOptionTypeName(option) {
        let color = option.type in this.categoryColorCodes ? this.categoryColorCodes[option.type] : "\\c[0]";
        let type = ig.lang.get(`sc.gui.el-gauntlet.bonuses.categoryTypes.${option.type}`);

        if(option.type === "special") {
            let langEntries = ig.lang.get<Record<string, string>>("sc.gui.el-gauntlet.bonuses.specialFuncLabels")
            if(option.specialFunc && option.specialFunc in langEntries) {
                type = langEntries[option.specialFunc];
            }
        }
        return color + type;
    },

    purchaseBonusOption(option) {
        const runtime = this.runtime;

        let cost = this.getBonusOptionCost(option);
        if(cost <= runtime.curPoints) {
            runtime.curPoints -= this.getBonusOptionCost(option);
            this.applyLevelUpBonus(option);
            ig.game.varsChangedDeferred();
            sc.Model.notifyObserver(this, el.GAUNTLET_MSG.UPGRADE_PURCHASED);
            return true;
        }
        return false;
    },

    generateBonusOptions() {
        const runtime = this.runtime;
        const cup = this.runtime.currentCup;
        const level = this.runtime.curLevel - this.runtime.levelDiff + 1;
        const bonuses = runtime.selectedBonuses;
        
        //const OptionsList = Object.values(cup.levelUpOptions);

        let choices: [string, number, el.GauntletController.BonusOption][] = [];
        let weightedSum = 0;
        //generate the list of level up options that can be picked in general.
        for(let [key, option] of getEntries(cup.bonusOptions)) {
            //makes sure the option can be picked.
            if(option.condition && !option.condition.evaluate()) continue;

            //options that don't repeat won't be selected again.
            if (bonuses[key]) {
                //option can't repeat.
                if(!option.repeat) continue;
                //option *can* repeat, but only to a limit.
                if(typeof option.repeat == "number" && option.repeat <= bonuses[key]) continue;
            }

            if(option.mutuallyExclusive) {
                if(option.mutuallyExclusive.find(x => x in bonuses)) continue;
            }

            if(option.requires) {
                if(option.requires.find(x => !(x in bonuses))) continue;
            }

            //ensures the level requirement is met.
            if(option.minLevel && level < option.minLevel) continue;

            let weight = this.getBonusOptionWeight(option);

            //this will break the algorithm 
            if(weight <= 0) continue;

            weightedSum += weight;
            choices.push([key, weightedSum, option]);
        }

        if(el.debug.gauntlet_printWeightTable) console.log(choices);
        
        //2: pick all of them.
        let options: string[] = [];
        let selections: string[] = [];
        while(options.length < this.numBonusOptions) {
            let randVal = Math.random() * weightedSum;
            let prevWeight = 0;

            for(let [key, weight, option] of choices) {
                if(prevWeight < randVal && randVal <= weight) {
                    if(!(selections.includes(key) || selections.includes(option.generalKey!))) {
                        if(option.mutuallyExclusive) {
                            if(option.mutuallyExclusive.find(x => options.includes(x))) continue;
                        }

                        selections.push(key);
                        if(option.generalKey) selections.push(option.generalKey);
                        
                        options.push(key);
                    }
                    break;
                } else prevWeight = weight;
            }
        }

        return options.map(option => cup.bonusOptions[option]).sort(() => (Math.random() - 0.5));
    },

    showBonusGui() {
        this.pauseExecution = true;
        this.pauseTimer();
        sc.model.enterCutscene(true);
        ig.game.events.callEvent(
            this.bonusEvent,
            ig.EventRunType.BLOCKING,
            null,
            this.onBonusGuiClose.bind(this)
        );
    },
    onBonusGuiClose() {
        sc.model.enterGame();
        this.pauseExecution = false;
        this.startTimer();
        this.startNextRound();
    },
    //#endregion

    //#region Inventory
    getItems() {
        if(!this.active) return [];
        let items = Object.entries(this.runtime.inventory);
        
        items.sort((a, b) => {
            let orderA = sc.inventory.getItem(a[0])!.order || 0;
            let orderB = sc.inventory.getItem(b[0])!.order || 0;

            if(sc.model.player.isFavorite(a[0])) orderA -= 1e6; 
            if(sc.model.player.isFavorite(b[0])) orderB -= 1e6; 
            
            return orderA - orderB;
        })

        return items;
    },

    //#endregion

    //#region Rank
    _getRank() {
        return el.GAUNTLET_RANKS[this.runtime.combatRankLevel];
    },
    getRankProgress() {
        return this.runtime.combatRankProgress !== ((el.GAUNTLET_RANKS.length) * 50 - 25) ? (this.runtime.combatRankProgress / (this.isSRank() ? 25 : 50)) % 1 : 1;
    },
    getRankLabel() {
        return this._getRank().rankLabel;
    },
    getRankPointMultiplier() {
        return this._getRank().pointMultiplier;
    },
    getRankExpMultiplier() {
        return this._getRank().expMultiplier;
    },
    getRankPenalty() {
        return this._getRank().penaltyMultiplier;
    },
    isSRank() {
        return this.runtime.combatRankLevel === el.GAUNTLET_RANKS.length - 1;
    },
    isRankDecaying() {
        return this.runtime.combatRankTimer <= 0;
    },
    addRank(value, applyPenalty = true) {
        let rankedUp = false;
        if(this.active) {
            let runtime = this.runtime;
            let isIncrease = value > 0;
            value = (applyPenalty && !isIncrease) ? value * this._getRank().penaltyMultiplier : value;
            runtime.combatRankProgress =
                (runtime.combatRankProgress + value).limit(0, (el.GAUNTLET_RANKS.length) * 50 - 25);
            
            if(Math.floor(runtime.combatRankProgress / 50) !== runtime.combatRankLevel) {
                runtime.combatRankLevel = Math.floor(runtime.combatRankProgress / 50);
                sc.Model.notifyObserver(this, el.GAUNTLET_MSG.RANK_CHANGED, value > 0);
                rankedUp = isIncrease;
            }

            if(isIncrease) {
                this.runtime.combatRankTimer = 10;
            }
        }

        return rankedUp;
    },
    //#endregion
})

sc.Arena.inject({
    //it was easier to just inject into this.
    onEnemyBreak(enemy) {
        this.parent(enemy);
        el.gauntlet.onEnemyBreak(enemy);
    }
})

sc.Combat.inject({
    onCombatantDeathHit(attacker, victim) {
        el.gauntlet.onCombatantDeathHit(attacker, victim);
        this.parent(attacker, victim);
    },
})

ig.ENTITY.Enemy.inject({
    el_gauntletEnemyInfo: null,

    onPreDamageModification(modifications, damagingEntity, attackInfo, partEntity, damageResult, shieldResult) {
        el.gauntlet.onEnemyDamage(this, damageResult);
        return this.parent(modifications, damagingEntity, attackInfo, partEntity, damageResult, shieldResult);
    },
})

ig.ENTITY.Player.inject({
    onPreDamageModification(modifications, damagingEntity, attackInfo, partEntity, damageResult, shieldResult) {
        el.gauntlet.onPlayerDamage(this, damageResult, shieldResult)
        return this.parent(modifications, damagingEntity, attackInfo, partEntity, damageResult, shieldResult);
    },
})

sc.ENEMY_REACTION.GUARD_COUNTER.inject({
    onGuardCountered(enemy, guardingEntity) {
        this.parent(enemy, guardingEntity);
        if(guardingEntity.getCombatantRoot().isPlayer) {
            el.gauntlet.onGuardCounter(enemy);
        }
    },
})

sc.PlayerModel.inject({
    useItem(id) {
        if(el.gauntlet.active) {
            let inventory = el.gauntlet.runtime.inventory;
            if(inventory[id] > 0) {
                inventory[id] -= 1;
                this.itemBlockTimer = this.getItemBlockTime();

                sc.stats.addMap("items", "used", 1);
                sc.stats.addMap("items", "used-" + id, 1);
                sc.stats.setMap("items", "usedTotal", this.getTotalItemsUsed(true));

                if(inventory[id] === 0) delete inventory[id];
                sc.Model.notifyObserver(this, sc.PLAYER_MSG.ITEM_USED, id);
                return true;
            }
            return false;
        } else return this.parent(id);
    },
})

ig.addGameAddon(() => (el.gauntlet = new el.GauntletController));