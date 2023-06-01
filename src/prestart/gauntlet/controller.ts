el.GAUNTLET_MESSAGE = {
    CHANGED_STATE: 0
}

const DEFAULT_RUNTIME: Readonly<el.GauntletController.Runtime> = {
    currentCup: null,
    curPoints: 0,
    totalPoints: 0,
    curXp: 0,
    currentRound: 0,
    roundEnemiesDefeated: 0,
    roundEnemiesGoal: 0,
} as const;

el.GauntletCup = ig.JsonLoadable.extend({
    enemyTypes: null,
    cacheType: "EL_GAUNTLET_CUP",

    getJsonPath() {
        return `${ig.root}${this.path.toPath("data/el-gauntlet/", ".json")}`
    },

    onload(data) {
        this.data = data;
        this.name = ig.LangLabel.getText(this.data.name);
        this.desc = ig.LangLabel.getText(this.data.description);
        this.condition = new ig.VarCondition(data.condition);

        this.enemyTypes = {};
        for(let [name, type] of Object.entries(data.enemyTypes)) {
            this.enemyTypes[name] = {
                enemyInfo: new sc.EnemyInfo(type.settings),
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

el.GauntletController = ig.GameAddon.extend({
    runtime: {...DEFAULT_RUNTIME},
    active: false,
    cups: {},
    partyStash: [],
    storedPartyBehavior: "OFFENSIVE",


    init() {
        this.parent("el-Gauntlet");
        this.registerCup(DEFAULT_CUPS);
        ig.vars.registerVarAccessor("el-gauntlet", this);
    },

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

        this.addGui();

        //note: move to elsewhere once menu is finalized
        sc.commonEvents.startCallEvent("el-gauntlet-start-cup")
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
            this._spawnEnemy(type.enemyInfo, enemy.pos, currentRound.level);
        }
    },

    checkForNextRound() {
        let runtime = this.runtime;
        if(runtime.roundEnemiesDefeated >= runtime.roundEnemiesGoal) {
            //TODO: move to common event
            this.startNextRound();
        }
    },

    _spawnEnemy(enemyInfo, marker, level, showEffects = true) {
        let pos = {...ig.game.getEntityByName(marker.marker).coll.pos};
        pos.x += marker.offX || 0;
        pos.y += marker.offY || 0;
        pos.z += marker.offZ || 0;

        //let enemyInfo = new sc.EnemyInfo({...enemySettings, level})

        enemyInfo.enemyType.load(() => {
            let entity = ig.game.spawnEntity(
                ig.ENTITY.Enemy,
                pos.x, pos.y, pos.z,
                {enemyInfo: enemyInfo.getSettings()},
                showEffects
            );
            entity.setLevelOverride(level);
            entity.setTarget(ig.game.playerEntity, true)
        })
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

    onCombatantDeathHit(attacker, victim) {
        if(this.active) {
            if(victim instanceof ig.ENTITY.Enemy) {
                this.addScore(victim.getLevel() * 10);
                this.runtime.roundEnemiesDefeated++;
                this.checkForNextRound();      
            }
        }
    },


    addScore(score) {
        if(this.active) {
            this.runtime.curPoints += score;
        }
        ig.game.varsChangedDeferred();
    },

    onVarAccess(path, keys) {
        if(keys[0] === "el-gauntlet") {
            switch(keys[1]) {
                case "active":
                    return this.active;
                case "points":
                    return this.runtime ? this.runtime.curPoints : 0;
                case "round":
                    return this.active ? this.runtime.currentRound : undefined;

            }
        }
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
    }
})

sc.Combat.inject({
    onCombatantDeathHit(attacker, victim) {
        el.gauntlet.onCombatantDeathHit(attacker, victim);
        this.parent(attacker, victim);
    },
})

ig.addGameAddon(() => (el.gauntlet = new el.GauntletController));
