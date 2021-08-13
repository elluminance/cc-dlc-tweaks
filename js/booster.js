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
        if(!this.ignoreAscended){
            if (this.boostedAscended && (b.boosterState === sc.ENEMY_BOOSTER_STATE.BOOSTABLE || b.boosterState === sc.ENEMY_BOOSTER_STATE.BOOSTED)) {
                b.setLevelOverride(!sc.newgame.get("scale-enemies") ? sc.model.player.level : sc.model.player.getParamAvgLevel(10))
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
