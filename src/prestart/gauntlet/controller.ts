import { getEntries } from "../../helper-funcs.js";

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

const PARTY_MEMBER_COST = 1000;
const DefaultIcon = "media/gui/gauntlet-icons/el-mod.png";

const DEFAULT_RUNTIME: el.GauntletController.Runtime = {
    currentCup: null,
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

    combatRankLevel: 0,
    combatRankProgress: 0,
    combatRankTimer: 0,

    playerStatOverride: undefined,
    levelDiff: 0,
    selectedBonuses: {},
    partySelected: 0,
};

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

el.GauntletCup = ig.JsonLoadable.extend({
    enemyTypes: null,
    cacheType: "EL_GAUNTLET_CUP",
    debugReload: true,
    levelUpOptions: {},

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

        const defaultOptions = el.GauntletCup.DefaultLevelUpOptions;

        let levelUpOptions = {
            ...defaultOptions.PARTY,
            ...defaultOptions.HEALING,
            ...defaultOptions.BASE_STATS,
            ...defaultOptions.SP,
        }

        for(let [key, value] of getEntries(levelUpOptions)) {
            this.levelUpOptions[key] = {
                ...value,
                key: key as string,
                icon: new ig.Image(value.iconSrc),
                condition: new ig.VarCondition(value.condition || "true"),
                type: value.type,
            }
        }
    },

    getName() {
        return this.name;
    }
})

el.GauntletCup.DefaultLevelUpOptions = {
    PARTY: {
        PARTY_EMILIE: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
            iconIndex: 10,
            partyMemberName: "Emilie",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Emilie && party.size < 5",
        },
        PARTY_CTRON: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
            iconIndex: 11,
            partyMemberName: "Glasses",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Glasses && party.size < 5",
        },
        PARTY_JOERN: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
            iconIndex: 12,
            partyMemberName: "Joern",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Joern && party.size < 5",
        },
        PARTY_APOLLO: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
            iconIndex: 13,
            partyMemberName: "Apollo",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Apollo && party.size < 5",
        },
        PARTY_LUKAS: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
            iconIndex: 14,
            partyMemberName: "Schneider",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Schneider && party.size < 5",
        },
        PARTY_SHIZUKA: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
            iconIndex: 15,
            partyMemberName: "Shizuka",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Shizuka && party.size < 5",
        },
        PARTY_LUKE: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
            iconIndex: 16,
            scaleType: "PARTY",
            partyMemberName: "Luke",
            cost: PARTY_MEMBER_COST,
            condition: "!party.has.Luke && party.size < 5",
        },
    },

    HEALING: {
        HEAL_SMALL: {
            type: "heal",
            iconSrc: DefaultIcon,

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.healing",
            descReplace: [{
                original: "[!]",
                replacement: 20
            }],
            iconIndex: 20,
            value: 0.20,
            repeat: true,
            cost: 400,
        },
        HEAL_MEDIUM: {
            type: "heal",
            iconSrc: DefaultIcon,

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.healing",
            descReplace: [{
                original: "[!]",
                replacement: 40
            }],
            iconIndex: 20,
            value: 0.40,
            repeat: true,
            cost: 750,
        },
        HEAL_LARGE: {
            type: "heal",
            iconSrc: DefaultIcon,

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.healing",
            descReplace: [{
                original: "[!]",
                replacement: 60
            }],
            iconIndex: 20,
            value: 0.6,
            repeat: true,
            cost: 1100,
        },
    },

    BASE_STATS: {
        MAXHP_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
            iconIndex: 21,
            name: "sc.gui.el-gauntlet.levelUp.genericName.maxhpUp",
            repeat: true,
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.el-gauntlet.levelUp.other.maxhp_full]"
            },{
                original: "[VALUE]",
                replacement: 100
            }],

            cost: 500,
            scaleType: "LINEAR",
            scaleFactor: 100,

            statType: "hp",
            absolute: true,
            value: 100
        },
        ATTACK_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
            iconIndex: 22,
            name: "sc.gui.el-gauntlet.levelUp.genericName.attackUp",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.atk]"
            },{
                original: "[VALUE]",
                replacement: 10
            }],

            cost: 500,
            scaleType: "LINEAR",
            scaleFactor: 100,

            statType: "attack",
            absolute: true,
            value: 10
        },
        DEFENSE_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
            iconIndex: 23,
            name: "sc.gui.el-gauntlet.levelUp.genericName.defenseUp",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.def]"
            },{
                original: "[VALUE]",
                replacement: 10
            }],

            cost: 500,
            scaleType: "LINEAR",
            scaleFactor: 100,

            statType: "defense",
            absolute: true,
            value: 10
        },
        FOCUS_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
            iconIndex: 24,
            name: "sc.gui.el-gauntlet.levelUp.genericName.focusUp",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.foc]"
            },{
                original: "[VALUE]",
                replacement: 10
            }],

            cost: 500,
            scaleType: "LINEAR",
            scaleFactor: 100,

            statType: "attack",
            absolute: true,
            value: 10
        },

        MAXHP_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
            iconIndex: 26,
            name: "sc.gui.el-gauntlet.levelUp.genericName.maxhpLevelUpBonus",
            repeat: true,
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.el-gauntlet.levelUp.other.maxhp_full]"
            },{
                original: "[VALUE]",
                replacement: 20
            }],

            cost: 1000,
            scaleType: "LINEAR",
            scaleFactor: 250,

            statType: "hp",
            absolute: true,
            value: 20
        },
        ATTACK_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
            iconIndex: 27,
            name: "sc.gui.el-gauntlet.levelUp.genericName.attackLevelUpBonus",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.atk]"
            },{
                original: "[VALUE]",
                replacement: 2
            }],

            cost: 1000,
            scaleType: "LINEAR",
            scaleFactor: 250,

            statType: "attack",
            value: 2
        },
        DEFENSE_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
            iconIndex: 28,
            name: "sc.gui.el-gauntlet.levelUp.genericName.defenseLevelUpBonus",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.def]"
            },{
                original: "[VALUE]",
                replacement: 2
            }],

            cost: 1000,
            scaleType: "LINEAR",
            scaleFactor: 250,

            statType: "defense",
            absolute: true,
            value: 2
        },
        FOCUS_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
            iconIndex: 29,
            name: "sc.gui.el-gauntlet.levelUp.genericName.focusLevelUpBonus",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.foc]"
            },{
                original: "[VALUE]",
                replacement: 2
            }],

            cost: 1000,
            scaleType: "LINEAR",
            scaleFactor: 250,

            statType: "attack",
            absolute: true,
            value: 2
        },
    },

    SP: {
        MAX_SP_1: {
            type: "statUp",
            iconSrc: DefaultIcon,
            iconIndex: 25,
            repeat: true,

            cost: 1000,
            scaleType: "LINEAR",
            scaleFactor: 1000,

            statType: "maxSp",
            value: 1
        },
    }
}

const DEFAULT_CUPS = ["test-gauntlet"];

function createRankBox(entity: ig.Entity) {
    return new sc.SmallEntityBox(entity, `${ig.lang.get("sc.gui.combat-msg.rank-up")} ${el.gauntlet.getRankLabel()}`, 2);
}



el.GauntletController = ig.GameAddon.extend({
    runtime: {...DEFAULT_RUNTIME},
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
    },

    init() {
        this.parent("el-Gauntlet");
        this.registerCup(DEFAULT_CUPS);
        ig.vars.registerVarAccessor("gauntlet", this);
        this.levelUpGui = new el.GauntletLevelUpGui;
        this.levelUpEvent = new ig.Event({
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
            //let currentStep: el.GauntletStep;


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
                            if(this.processLevel()) {
                                this.showLevelGui();
                            }
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

        this.runtime = {...DEFAULT_RUNTIME};
        let cup = this.cups[name];
        let runtime = this.runtime;
        
        runtime.currentCup = cup;
        runtime.currentRound = 0;

        runtime.playerStatOverride = new el.StatOverride(cup.playerStats);
        runtime.playerStatOverride.addModel(sc.model.player);
        
        runtime.statIncrease = {...cup.statIncrease}
        //sc.model.player.statOverride.applyOverride(cup.playerStats);

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
        if(keys[0] === "gauntlet") {
            switch(keys[1]) {
                case "active":
                    return this.active;
                case "points":
                    return this.runtime ? Math.round(this.runtime.curPoints) : 0;
                case "round":
                    return this.active ? this.runtime.currentRound : undefined;
                case "bonus":
                    return true;
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
                null,
                null,
                null,
                true,
                true,
                null,
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

        switch(option.type) {
            case "statUp":
            case "modifier":
                let statOverride = runtime.playerStatOverride!;
                if(option.statType === "maxSp") {
                    statOverride.addSp(option.value);
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
            case "item": //todo: once i add in the new item inventory
                break;
        }
    },

    getLevelOptionCost(option) {
        const runtime = this.runtime;
        //TODO: Apply cost scaling.
        switch(option.scaleType) {
            case "LINEAR":
                return option.cost + option.scaleFactor! * (runtime.selectedBonuses[option.key] || 0);
            case "PARTY":
                return option.cost * (2 ** runtime.partySelected);
        }
        
        return option.cost;
    },
    getLevelOptionName(option) {
        if(option.name) {
            if(typeof option.name == "string") {
                return ig.lang.get(option.name);
            } else {
                return ig.LangLabel.getText(option.name);
            }
        }
        return ig.lang.get(`sc.gui.el-gauntlet.levelUp.options.${option.key}.name`);
    },
    getLevelOptionDesc(option) {
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
        return ig.lang.get(`sc.gui.el-gauntlet.levelUp.options.${option.key}.shortDesc`);
    },
    getLevelOptionTypeName(option) {
        let color = option.type in this.categoryColorCodes ? this.categoryColorCodes[option.type] : "\\c[0]";

        return color + ig.lang.get(`sc.gui.el-gauntlet.levelUp.categoryTypes.${option.type}`);
    },

    purchaseLevelOption(option) {
        const runtime = this.runtime;

        let cost = this.getLevelOptionCost(option);
        if(cost <= runtime.curPoints) {
            runtime.curPoints -= this.getLevelOptionCost(option);
            this.applyLevelUpBonus(option);
            ig.game.varsChangedDeferred();
            sc.Model.notifyObserver(this, el.GAUNTLET_MSG.UPGRADE_PURCHASED);
            return true;
        }
        return false;
    },

    generateLevelUpOptions() {
        let cup = this.runtime.currentCup!;
        const OptionsList = Object.values(cup.levelUpOptions);

        let options: typeof OptionsList = [];

        while(options.length < 4) {
            let gennedOption = OptionsList.random();

            if(gennedOption.condition && !gennedOption.condition.evaluate()) continue;

            if(!options.includes(gennedOption)) options.push(gennedOption);
        }

        return options
    },

    showLevelGui() {
        this.pauseExecution = true;
        this.pauseTimer();
        sc.model.enterCutscene(true);
        ig.game.events.callEvent(
            this.levelUpEvent,
            ig.EventRunType.BLOCKING,
            null,
            this.onLevelGuiClose.bind(this)
        );
    },
    onLevelGuiClose() {
        this.runtime.levelDiff -= 1;
        sc.model.enterGame();
        if(this.runtime.levelDiff > 0) {
            this.showLevelGui();
        } else {
            this.pauseExecution = false;
            this.startTimer();
            this.startNextRound();
        }
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

ig.addGameAddon(() => (el.gauntlet = new el.GauntletController));