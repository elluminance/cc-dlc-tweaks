el.GAUNTLET_MSG = {
    RANK_CHANGED: 0,
    ROUND_STARTED: 1,
    LEVEL_CHANGED: 2,
    EXP_CHANGED: 3,
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

const DEFAULT_RUNTIME: el.GauntletController.Runtime = {
    currentCup: null,
    curPoints: 0,
    totalPoints: 0,
    curXp: 0,
    curLevel: 1,
    currentRound: 0,
    roundEnemiesDefeated: 0,
    roundEnemiesGoal: 0,

    combatRankLevel: 0,
    combatRankProgress: 0,
    combatRankTimer: 0,
} as const;

el.GauntletCup = ig.JsonLoadable.extend({
    enemyTypes: null,
    cacheType: "EL_GAUNTLET_CUP",
    debugReload: true,

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
            
            this.enemyTypes[name] = {
                enemyInfo: new sc.EnemyInfo(type.settings),
                xp: type.xp,
                buff: statChange,
                levelOffset: type.levelOffset || 0,
                pointMultiplier: type.pointMultiplier || 1,
            }
        }

        this.rounds = data.rounds;
        this.playerStats = data.playerStats;
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
    runtime: {...DEFAULT_RUNTIME},
    active: false,
    cups: {},
    partyStash: [],
    storedPartyBehavior: "OFFENSIVE",

    observers: [],

    init() {
        this.parent("el-Gauntlet");
        this.registerCup(DEFAULT_CUPS);
        ig.vars.registerVarAccessor("el-gauntlet", this);
    },

    onPostUpdate() {
        if(this.active && !ig.loading && !ig.game.paused) {
            if(this.runtime.combatRankTimer <= 0) {
                this.addRank(-ig.system.tick * 5, false);
            } else {
                this.runtime.combatRankTimer -= ig.system.tick;
            }
        }
    },

    onLevelLoaded() {
        if(this.active) {
            sc.commonEvents.startCallEvent("el-gauntlet-start-cup");
            this.addGui();
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

    startGauntlet(name) {
        this.active = true;

        sc.model.setMobilityBlock("CHECKPOINT")
        sc.model.player.setCore(sc.PLAYER_CORE.CREDITS, false);
        sc.model.player.setCore(sc.PLAYER_CORE.EXP, false);
        sc.model.player.setCore(sc.PLAYER_CORE.ITEMS, false);

        this.runtime = {...DEFAULT_RUNTIME};
        let cup = this.cups[name];
        this.runtime.currentCup = cup;
        this.runtime.currentRound = 0;
        sc.model.player.el_statOverride.applyOverride(cup.playerStats);

        this.storedPartyBehavior = sc.party.strategyKeys.BEHAVIOUR;
        this.stashPartyMembers();

        ig.game.teleport(cup.map, cup.marker ? new ig.TeleportPosition(cup.marker) : null)
    },

    startNextRound() {
        let runtime = this.runtime;
        runtime.currentRound++;
        let cup = runtime.currentCup!;
        if(runtime.currentRound > cup.rounds.length) {
            // maybe do a crash or something later, but for debugging
            // this is more than fine.
            console.warn("Reached end of cup, and tried to go to next round!")
            return;
        }
        let currentRound = cup.rounds[runtime.currentRound - 1];
        let enemyTypes = cup.enemyTypes;
        runtime.roundEnemiesDefeated = 0;
        runtime.roundEnemiesGoal = currentRound.enemies.length;
        for(let enemy of currentRound.enemies) {
            let type = enemyTypes[enemy.type];
            let entity = this._spawnEnemy(type.enemyInfo, enemy.pos, currentRound.level + type.levelOffset);
            entity.el_gauntletEnemyInfo = type;
            if(type.buff) {
                entity.params.addBuff(type.buff);
            }
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
        this.roundGui = ig.gui.createEventGui("round", "CounterHud", {
            taskTitle: ig.lang.get("sc.gui.el-gauntlet.round"),
            maxCount: this.runtime.currentCup!.rounds.length,
            time: 0.2,
            useDots: true,
            variable: "el-gauntlet.round",
            cutsceneOkay: true
        });
        ig.gui.spawnEventGui(this.roundGui!);

        this.scoreGui = ig.gui.createEventGui("points", "ScoreHud", {
            taskTitle: ig.lang.get("sc.gui.el-gauntlet.points"),
            maxValue: 999999999,
            time: 0.2,
            useDots: true,
            variable: "el-gauntlet.points",
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

    checkForNextRound() {
        let runtime = this.runtime;
        if(runtime.roundEnemiesDefeated >= runtime.roundEnemiesGoal) {
            //TODO: move to common event
            this.startNextRound();
        }
    },

    onVarAccess(_path, keys) {
        if(keys[0] === "el-gauntlet") {
            switch(keys[1]) {
                case "active":
                    return this.active;
                case "points":
                    return this.runtime ? Math.round(this.runtime.curPoints) : 0;
                case "round":
                    return this.active ? this.runtime.currentRound : undefined;

            }
        }
    },

    _spawnEnemy(enemyInfo, marker, level, showEffects = true) {
        let pos = {...ig.game.getEntityByName(marker.marker).coll.pos};
        pos.x += marker.offX || 0;
        pos.y += marker.offY || 0;
        pos.z += marker.offZ || 0;

        //let enemyInfo = new sc.EnemyInfo({...enemySettings, level})

        let entity = ig.game.spawnEntity(
            ig.ENTITY.Enemy,
            pos.x, pos.y, pos.z,
            {enemyInfo: enemyInfo.getSettings()},
            showEffects
        );
        entity.setLevelOverride(level);
        entity.setTarget(ig.game.playerEntity, true)

        return entity;
    },
    //#endregion

    //#region Points
    onCombatantDeathHit(attacker, victim) {
        if(this.active) {
            if(victim instanceof ig.ENTITY.Enemy) {
                this.addPoints(victim.getLevel() * 10 * victim.el_gauntletEnemyInfo!.pointMultiplier);
                this.runtime.roundEnemiesDefeated++;
                this.checkForNextRound();
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
            this.runtime.curPoints += score * this.getRankPointMultiplier();
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
