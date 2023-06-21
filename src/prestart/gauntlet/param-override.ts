const elementBonusDefault = {
    hp: 0,
    attack: 0,
    defense: 0,
    focus: 0,

    modifiers: {}
} as const;

sc.SP_LEVEL[5] = 20;
sc.SP_LEVEL[6] = 24;
sc.SP_LEVEL[7] = 28;
sc.SP_LEVEL[8] = 32;

sc.SP_REGEN_SPEED[20] = 1.8;
sc.SP_REGEN_SPEED[24] = 2;
sc.SP_REGEN_SPEED[28] = 2.2;
sc.SP_REGEN_SPEED[32] = 2.4;



sc.PlayerModel.inject({
    statOverride: null,

    init() {
        this.parent();
    },

    reset() {
        this.statOverride = null;
        this.parent();
    },

    updateStats() {
        if(this.statOverride?.active) {
            this.baseParams.hp = this.statOverride.hp;
            this.baseParams.attack = this.statOverride.attack;
            this.baseParams.defense = this.statOverride.defense;
            this.baseParams.focus = this.statOverride.focus;
            for(let element in sc.ELEMENT) {
                let config = this.elementConfigs[sc.ELEMENT[element as keyof typeof sc.ELEMENT]];
                let elemBonus = this.statOverride.elementBonus[element as keyof typeof sc.ELEMENT];
                
                let actions = config.activeActions;
                config.preSkillInit();
                config.activeActions = actions;
                config.skillFactors.hp = elemBonus.hp;
                config.skillFactors.attack = elemBonus.attack;
                config.skillFactors.defense = elemBonus.defense;
                config.skillFactors.focus = elemBonus.focus;
                config.update(this.baseParams, {});
            }
            let curSp = this.params.currentSp;
            if(this.statOverride.spLevel) {
                let maxSp = sc.SP_LEVEL[this.statOverride.spLevel];
                this.params.setMaxSp(maxSp);
                this.params.setRelativeSp(sc.SP_REGEN_FACTOR);
                sc.Model.notifyObserver(this.params, sc.COMBAT_PARAM_MSG.SP_CHANGED)
            }
            this.params.currentSp = Math.min(curSp, this.params.maxSp);
            this.params.setBaseParams(this.elementConfigs[this.currentElementMode].baseParams);
            sc.Model.notifyObserver(this, sc.PLAYER_MSG.STATS_CHANGED);
        } else {
            this.params.setMaxSp(sc.SP_LEVEL[this.spLevel]);
            this.params.setRelativeSp(sc.SP_REGEN_FACTOR);
            sc.Model.notifyObserver(this.params, sc.COMBAT_PARAM_MSG.SP_CHANGED)
            this.parent();
        }
    },

    el_updateStatOverride() {
        this.updateStats();
    }
})

el.StatOverride = ig.Class.extend({
    roots: null,
    hp: 3600,
    attack: 360,
    defense: 360,
    focus: 360,
    spLevel: 2,
    modifiers: {},

    elementBonus: {
        NEUTRAL: {
            hp: 0,
            attack: 0,
            defense: 0,
            focus: 0,

            modifiers: {}
        },
        HEAT: {
            hp: 0,
            attack: 0,
            defense: 0,
            focus: 0,

            modifiers: {}
        },
        COLD: {
            hp: 0,
            attack: 0,
            defense: 0,
            focus: 0,

            modifiers: {}
        },
        SHOCK: {
            hp: 0,
            attack: 0,
            defense: 0,
            focus: 0,

            modifiers: {}
        },
        WAVE: {
            hp: 0,
            attack: 0,
            defense: 0,
            focus: 0,

            modifiers: {}
        },
    },
    active: false,

    init(stats) {
        this.hp = stats.hp;
        this.attack = stats.attack;
        this.defense = stats.defense;
        this.hp = stats.hp;
        this.spLevel = stats.spLevel;
        this.modifiers = {...(stats.modifiers || {})};
        this.active = true;
        
        this.roots = new Set();
    },

    setActive(state) {
        this.active = state;

        for(let root of this.roots) root.el_updateStatOverride();
    },

    updateStats(stats, changeMode = "set", factor = 1) {
        switch(changeMode) {
            case "set":
                if(stats.hp) this.hp = stats.hp * factor;
                if(stats.attack) this.attack = stats.attack * factor;
                if(stats.defense) this.defense = stats.defense * factor;
                if(stats.focus) this.focus = stats.focus * factor;
                break;
            case "add":
                if(stats.hp) this.hp += stats.hp * factor;
                if(stats.attack) this.attack += stats.attack * factor;
                if(stats.defense) this.defense += stats.defense * factor;
                if(stats.focus) this.focus += stats.focus * factor;
                break;
            case "mul":
                if(stats.hp) this.hp *= stats.hp * factor;
                if(stats.attack) this.attack *= stats.attack * factor;
                if(stats.defense) this.defense *= stats.defense * factor;
                if(stats.focus) this.focus *= stats.focus * factor;
                break;
        }

        for(let root of this.roots) root.el_updateStatOverride();
    },

    applyModel(model) {
        if(model.statOverride === this) return;

        if(model.statOverride) {
            model.statOverride.removeModel(model);
        }

        this.roots.add(model);

        model.statOverride = this;

        model.el_updateStatOverride();
    },

    removeModel(model) {
        if(this.roots.has(model)) {
            model.statOverride = null;
            this.roots.delete(model);
            model.el_updateStatOverride();
        }
    },
})