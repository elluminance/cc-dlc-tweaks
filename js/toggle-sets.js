// ascended booster
sc.EnemyBooster.inject({
    boostedAscended: false,
    // this next one exists to fix the bug of having both a normal/ascended booster on,
    // then turning the ascended booster off, which would keep enemies at an "ascended" level
    ignoreAscended: false, 

    updateBoosterState(){
        this.parent()
        let ascendedBooster = sc.model.player.getToggleItemState("dlctweaks-ascended-booster")
        if(this.boostedAscended != ascendedBooster){
            this.boostedAscended = ascendedBooster;
            for (let entities = ig.game.getEntitiesByType(ig.ENTITY.Enemy), index = entities.length; index--;) this.updateEnemyBoostState(entities[index])
        }
    },

    updateEnemyBoostState(b){
        this.parent(b)
        // ignore unboostable enemies
        if(b.boosterState == sc.ENEMY_BOOSTER_STATE.NONE) return;

        if(!this.ignoreAscended){
            if (this.boostedAscended && (b.boosterState === sc.ENEMY_BOOSTER_STATE.BOOSTABLE || b.boosterState === sc.ENEMY_BOOSTER_STATE.BOOSTED)) {
                // set enemy levels to at minimum their standard boosted level, otherwise the player's level.
                let ascendedLevel = (sc.model.player.level >= (b.enemyType.boostedLevel || sc.MIN_BOOSTER_LEVEL)) 
                                    ? sc.model.player.level 
                                    : (b.enemyType.boostedLevel || sc.MIN_BOOSTER_LEVEL);
                // check if GoML is enabled, and boost enemies beyond what a booster would otherwise do.
                b.setLevelOverride(sc.newgame.get("scale-enemies") ? sc.model.player.getParamAvgLevel(10) : ascendedLevel)
                b.boosterState = sc.ENEMY_BOOSTER_STATE.BOOSTED;
            } else {
                b.boosterState = sc.ENEMY_BOOSTER_STATE.BOOSTABLE;
                this.ignoreAscended = true;
                this.updateEnemyBoostState(b) // just let the function set it to what it needs to be, ignoring the ascended booster 
                this.ignoreAscended = false;
            }
        }
    }
})


// special toggle sets
sc.NewGamePlusModel.inject({
    get(b) {
        switch(b){
            case "lea-must-die":
                if(sc.model.player.getToggleItemState("el-toggle-lea-must-die")) return true
            case "disable-exp":
                if(sc.model.player.getToggleItemState("el-toggle-disable-exp")) return true
        };

        return this.parent(b)
    }
})