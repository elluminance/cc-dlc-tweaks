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
    el_statOverride: null,

    init() {
        this.parent();

        this.el_statOverride = new el.StatOverride(this);
    },

    reset() {
        this.el_statOverride.setActive(false);
        this.parent();
    },

    updateStats() {
        if(this.el_statOverride.active) {
            this.baseParams.hp = this.el_statOverride.hp;
            this.baseParams.attack = this.el_statOverride.attack;
            this.baseParams.defense = this.el_statOverride.defense;
            this.baseParams.focus = this.el_statOverride.focus;
            for(let element in sc.ELEMENT) {
                let config = this.elementConfigs[sc.ELEMENT[element as keyof typeof sc.ELEMENT]];
                let elemBonus = this.el_statOverride.elementBonus[element as keyof typeof sc.ELEMENT];
                
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
            if(this.el_statOverride.spLevel) {
                let maxSp = sc.SP_LEVEL[this.el_statOverride.spLevel];
                this.params.setMaxSp(maxSp);
                this.params.setRelativeSp(sc.SP_REGEN_FACTOR);
            }
            this.params.currentSp = Math.min(curSp, this.params.maxSp);
            this.params.setBaseParams(this.elementConfigs[this.currentElementMode].baseParams);
            sc.Model.notifyObserver(this, sc.PLAYER_MSG.STATS_CHANGED);
        } else {
            this.params.setMaxSp(sc.SP_LEVEL[this.spLevel]);
            this.params.setRelativeSp(sc.SP_REGEN_FACTOR);
            this.parent();
        }
    },

    el_enableStatOverride(state) {
        this.el_statOverride.setActive(state);
    }
})

el.StatOverride = ig.Class.extend({
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

    init(root) {
        this.root = root;
    },

    setActive(state) {
        this.active = state;

        this.root.updateStats();
    },

    applyOverride(override) {
        this.hp = override.hp;
        this.attack = override.attack;
        this.defense = override.defense;
        this.focus = override.focus;

        if(override.modifiers) {
            this.modifiers = {...override.modifiers};
        } else {
            this.modifiers = {};
        }

        this.setActive(true);
    },
})

ig.EVENT_STEP.EL_ENABLE_STAT_OVERRIDE = ig.EventStepBase.extend({
    state: false,

    init(settings) {
        this.state = settings.state;
    },

    start() {
        sc.model.player.el_enableStatOverride(this.state);
        //will eventually add party member stuff
    }
})