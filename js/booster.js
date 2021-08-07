sc.EnemyBooster.inject({
    boostedAscended: false,

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
        //TODO: when asc. booster is turned off, but normal booster is on, enemy level stays ascended
        if (sc.model.player.getToggleItemState("dlctweaks-ascended-booster") && (b.boosterState === sc.ENEMY_BOOSTER_STATE.BOOSTABLE || b.boosterState === sc.ENEMY_BOOSTER_STATE.BOOSTED)) {
            b.setLevelOverride(!sc.newgame.get("scale-enemies") ? sc.model.player.level : sc.model.player.getParamAvgLevel(10))
            b.boosterState = sc.ENEMY_BOOSTER_STATE.BOOSTED;
        }
    }
})
