sc.EnemyBooster.inject({
    updateEnemyBoostState(b){
        if (b.boosterState != sc.ENEMY_BOOSTER_STATE.NONE){
            if (this.boosted && b.boosterState == sc.ENEMY_BOOSTER_STATE.BOOSTABLE) {
                b.boosterState = sc.ENEMY_BOOSTER_STATE.BOOSTED;
                var a = b.enemyType.boostedLevel || sc.MIN_BOOSTER_LEVEL;
                sc.newgame.get("scale-enemies") && (a = sc.model.player.getParamAvgLevel(10));
                b.setLevelOverride(a)
            } else if (!this.boosted && b.boosterState == sc.ENEMY_BOOSTER_STATE.BOOSTED) {
            b.boosterState = sc.ENEMY_BOOSTER_STATE.BOOSTABLE;
            b.level.setting ? b.setLevelOverride(1 * ig.Event.getExpressionValue(b.level.setting)) : b.setLevelOverride(null)
        }}
        if (sc.model.player.getToggleItemState("dlctweaks-ascended-booster") && b.boosterState == sc.ENEMY_BOOSTER_STATE.BOOSTABLE) {
            b.setLevelOverride(!sc.newgame.get("scale-enemies") ? sc.model.player.level : sc.model.player.getParamAvgLevel(10))
            b.boosterState = sc.ENEMY_BOOSTER_STATE.BOOSTED;
        }
    }
})