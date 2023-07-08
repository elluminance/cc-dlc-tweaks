import { getEntries } from "../../helper-funcs.js";

type ELEMENT_KEY = keyof typeof sc.ELEMENT;

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

    reset() {
        this.statOverride?.removeModel(this);
        this.parent();
    },

    updateStats() {
        if(this.statOverride?.active) {
            this.baseParams.hp = this.statOverride.hp;
            this.baseParams.attack = this.statOverride.attack;
            this.baseParams.defense = this.statOverride.defense;
            this.baseParams.focus = this.statOverride.focus;
            let element: ELEMENT_KEY;
            for(element in sc.ELEMENT) {
                let config = this.elementConfigs[sc.ELEMENT[element as ELEMENT_KEY]];
                //let elemBonus = this.statOverride.elementBonus[element as ELEMENT_KEY];
                
                let actions = config.activeActions;
                config.preSkillInit();
                config.activeActions = actions;
                config.update(
                    this.statOverride.getBaseParams(element),
                    this.statOverride.getModifiers(element)
                );
            }
            if(this.statOverride.spLevel !== this.params.maxSp && this.statOverride.spLevel) {
                let curSp = this.params.currentSp;
                let maxSp = sc.SP_LEVEL[this.statOverride.spLevel];
                this.params.setMaxSp(maxSp);
                this.params.currentSp = Math.min(curSp, maxSp);
                sc.Model.notifyObserver(this.params, sc.COMBAT_PARAM_MSG.SP_CHANGED)
            }
            this.params.setBaseParams(this.elementConfigs[this.currentElementMode].baseParams);
            this.params.setModifiers(this.elementConfigs[this.currentElementMode].modifiers);
            sc.Model.notifyObserver(this, sc.PLAYER_MSG.STATS_CHANGED);
        } else {
            this.params.setMaxSp(sc.SP_LEVEL[this.spLevel]);
            this.params.setRelativeSp(sc.SP_REGEN_FACTOR);
            sc.Model.notifyObserver(this.params, sc.COMBAT_PARAM_MSG.SP_CHANGED);
            this.parent();
        }
    },

    el_updateStatOverride() {
        this.updateStats();
    }
})

sc.PartyMemberModel.inject({
    statOverride: null,

    reset() {
        this.statOverride?.removeModel(this);
        this.parent();
    },

    updateStats() {
        if(this.statOverride?.active) {
            for(let element in sc.ELEMENT) {
                let config = this.elementConfigs[sc.ELEMENT[element as ELEMENT_KEY]];
                let activeActions = config.activeActions;

                config.preSkillInit();
                config.activeActions = activeActions;

                config.update(
                    this.statOverride.getBaseParams(element as ELEMENT_KEY),
                    this.statOverride.getModifiers(element as ELEMENT_KEY)
                );
            }

            if(this.statOverride.spLevel !== this.params.maxSp && this.statOverride.spLevel) {
                let curSp = this.params.currentSp;
                let maxSp = sc.SP_LEVEL[this.statOverride.spLevel];
                this.params.setMaxSp(maxSp);
                this.params.currentSp = Math.min(curSp, maxSp);
                sc.Model.notifyObserver(this.params, sc.COMBAT_PARAM_MSG.SP_CHANGED)
            }

            this.params.setBaseParams(this.elementConfigs[this.currentElementMode].baseParams);
            this.params.setModifiers(this.elementConfigs[this.currentElementMode].modifiers);
            
            sc.Model.notifyObserver(this, sc.PARTY_MEMBER_MSG.STATS_CHANGED);
        } else this.parent();
    },

    el_updateStatOverride() {
        this.updateStats();
    },
})



el.StatOverride = ig.Class.extend({
    roots: null,
    hp: 3600,
    attack: 360,
    defense: 360,
    focus: 360,
    neutralEfficacy: 0.5,
    spLevel: null,
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

        this._updateModifications();
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

        this._updateModifications();
    },

    changeSp(newValue) {
        this.spLevel = newValue;
        this._updateModifications();
    },
    addSp(value) {
        if(this.spLevel) {
            this.spLevel += value;
        } else this.spLevel = value;
        this._updateModifications();
    },

    setNeutralEfficacy(value) {
        
    },
    setElementUniversalBonus(element, value) {
        
    },

    _updateModifications() {
        for(let root of this.roots) root.el_updateStatOverride();
    },

    addModel(model) {
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

    getBaseParams(element) {
        let params: sc.CombatParams.BaseParams = {
            hp: this.hp,
            attack: this.attack,
            defense: this.defense,
            focus: this.focus,

            elemFactor: [1, 1, 1, 1],
            statusEffect: [1, 1, 1, 1],
            statusInflict: [1, 1, 1, 1],
        }

        if(element) {
            let bonusHp = this.elementBonus[element].hp;
            let bonusAtk = this.elementBonus[element].attack;
            let bonusDef = this.elementBonus[element].defense;
            let bonusFoc = this.elementBonus[element].focus;

            if(element !== "NEUTRAL") {
                bonusHp += this.elementBonus["NEUTRAL"].hp * this.neutralEfficacy;
                bonusAtk += this.elementBonus["NEUTRAL"].attack * this.neutralEfficacy;
                bonusDef += this.elementBonus["NEUTRAL"].defense * this.neutralEfficacy;
                bonusFoc += this.elementBonus["NEUTRAL"].focus * this.neutralEfficacy;
            }
            
            params.hp *= 1 + bonusHp;
            params.attack *= 1 + bonusAtk;
            params.defense *= 1 + bonusDef;
            params.focus *= 1 + bonusFoc;
        }

        return params;
    },

    getModifiers(element) {
        let modifiers = {...this.modifiers};

        if(element) {
            for(let [key, val] of getEntries(this.elementBonus[element].modifiers)) {
                if(key in modifiers) {
                    modifiers[key]! *= val;
                } else {
                    modifiers[key] = val;
                }
            }
        }

        return modifiers;
    },
})