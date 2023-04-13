sc.PlayerModel.inject({
    el_statOverride: {
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
                attack: 0.25,
                defense: 0,
                focus: 0,

                modifiers: {}
            },
            COLD: {
                hp: 0,
                attack: 0,
                defense: 0.25,
                focus: 0,

                modifiers: {}
            },
            SHOCK: {
                hp: 0,
                attack: 0,
                defense: 0,
                focus: 0.25,

                modifiers: {}
            },
            WAVE: {
                hp: 0.25,
                attack: 0,
                defense: 0,
                focus: 0,

                modifiers: {}
            },
        },
        active: false
    },
    
    reset() {
        this.parent();
        this.el_statOverride.active = false;
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
                config.preSkillInit();
                config.skillFactors.hp = elemBonus.hp;
                config.skillFactors.attack = elemBonus.attack;
                config.skillFactors.defense = elemBonus.defense;
                config.skillFactors.focus = elemBonus.focus;
                config.update(this.baseParams, {});
            } 
            this.params.setMaxSp(sc.SP_LEVEL[this.el_statOverride.spLevel]);
            this.params.setBaseParams(this.elementConfigs[this.currentElementMode].baseParams);
            sc.Model.notifyObserver(this, sc.PLAYER_MSG.STATS_CHANGED);
        } else {
            this.params.setMaxSp(sc.SP_LEVEL[this.spLevel]);
            this.parent();
        }
    },

    enableStatOverride(active) {
        this.el_statOverride.active = active;
        this.updateStats();
    }
})