export default function() {
sc.EnemyBooster.inject({
    ascendedBooster: {
        active: false,     // if ascended booster is enabled 
        skipCheck: false,  // skip check in cases such as turning off the booster to set level to normal value
        forceCheck: false, // force a check in cases such as a level up
        calcLevel: enemyType => Math.max(sc.model.player.level, (enemyType.boostedLevel || sc.MIN_BOOSTER_LEVEL))
    },

    updateBoosterState(){
        this.parent()
        let ascendedBooster = sc.model.player.getToggleItemState("dlctweaks-ascended-booster")
        if(this.ascendedBooster.forceCheck || (this.ascendedBooster.active != ascendedBooster)){
            this.ascendedBooster.active = ascendedBooster;
            for (let entities = ig.game.getEntitiesByType(ig.ENTITY.Enemy), index = entities.length; index--;){ 
                this.updateEnemyBoostState(entities[index] as ig.ENTITY.Enemy)
            }
            this.ascendedBooster.forceCheck = false;
        }
    },

    updateEnemyBoostState(enemy){
        this.parent(enemy)
        
        if((enemy.boosterState != sc.ENEMY_BOOSTER_STATE.NONE) && !this.ascendedBooster.skipCheck){
            if (this.ascendedBooster.active) {
                // set enemy levels to at minimum their standard boosted level, otherwise the player's level.
                let ascendedLevel = this.ascendedBooster.calcLevel(enemy.enemyType);
                // check if GoML is enabled, and boost enemies beyond what a booster would otherwise do.
                enemy.setLevelOverride(sc.newgame.get("scale-enemies") ? sc.model.player.getParamAvgLevel(14) : ascendedLevel)
                enemy.boosterState = sc.ENEMY_BOOSTER_STATE.BOOSTED;
            } else {
                enemy.boosterState = sc.ENEMY_BOOSTER_STATE.BOOSTABLE;
                this.ascendedBooster.skipCheck = true;
                this.parent(enemy) // just let the function set it to what it needs to be, ignoring the ascended booster 
                this.ascendedBooster.skipCheck = false;
            }
        }
    },

    modelChanged(source, message, data){
        if(source instanceof sc.PlayerModel && message == sc.PLAYER_MSG.LEVEL_CHANGE){
            this.ascendedBooster.forceCheck = true 
            this.updateBoosterState()
        }
        this.parent(source, message, data)
    }
})

sc.EnemyInfoBox.inject({
    setEnemy(b){
        const ascBooster = sc.model.player.getToggleItemState("dlctweaks-ascended-booster");
        this.parent(b);
        if(this.enemy && ascBooster && sc.combat.canShowBoostedEntry(b, this.enemy.boss)){
            this.level.setNumber(sc.enemyBooster.ascendedBooster.calcLevel(b as any))
        }
    }
})

sc.EnemyEntryButton.inject({
    init(b, a, d){
        let enemyType = sc.combat.enemyDataList[a!];
        this.parent(b, a, d);
        if(d! >= 0 && sc.model.player.getToggleItemState("dlctweaks-ascended-booster") && sc.combat.canShowBoostedEntry(a!, enemyType.boss)) {
            this.level.setNumber(sc.enemyBooster.ascendedBooster.calcLevel(enemyType))
        }
    }
})

sc.EnemyDisplayGui.inject({
    init(b, a, d, c, e, f){
        this.parent(b, a, d, c, e, sc.model.player.getToggleItemState("dlctweaks-ascended-booster") || f);
    }
})

function getGeodeBaseDropRate(itemDrops: sc.EnemyType.ItemDrop[]): number {
    let geodeChance = 0.03

    let foundItem = itemDrops.find(
        element => sc.BOOSTER_GEMS.includes(Number(element.item) || element.item)
    );
    
    if(foundItem) {
        geodeChance *= ((foundItem.prob / 0.025).limit(0, 10) / 10) + 1
    }

    return geodeChance
}

sc.EnemyPageGeneralInfo.inject({
    setData(enemyName, enemyType, f, boosted){
        const ascBooster = sc.model.player.getToggleItemState("dlctweaks-ascended-booster");
        let oldBoostedLevel;
        let canShowBoosted = enemyType && sc.combat.canShowBoostedEntry(enemyName, enemyType.boss);
        if(enemyType && canShowBoosted){
            oldBoostedLevel = enemyType.boostedLevel || sc.MIN_BOOSTER_LEVEL;
            if(ascBooster) enemyType.boostedLevel = sc.enemyBooster.ascendedBooster.calcLevel(enemyType) 
        }
        this.parent(enemyName, enemyType, f, ascBooster || boosted)
        
        enemyType && oldBoostedLevel && (enemyType.boostedLevel = oldBoostedLevel);

        if(enemyType && canShowBoosted){
            let itemList = [...enemyType.itemDrops];
            if(sc.enemyBooster.ascendedBooster.active) {
                itemList.push({
                    boosted: false,
                    condition: "stat.items.el-item-geode >= 1",
                    item: "el-item-geode",
                    max: 1,
                    min: 1,
                    prob: getGeodeBaseDropRate(enemyType.itemDrops),
                    rank: "D"
                })
                this.drops.setDrops(itemList, f, true)
            }
        }
    }
})

sc.EnemyType.inject({
    resolveItemDrops(enemyEntity) {
        this.parent(enemyEntity);
        if(sc.enemyBooster.ascendedBooster.active 
          && sc.model.player.getCore(sc.PLAYER_CORE.ITEMS)
          && enemyEntity.boosterState == sc.ENEMY_BOOSTER_STATE.BOOSTED
        ) {
            let geodeChance = getGeodeBaseDropRate(this.itemDrops)
            geodeChance *= sc.model.player.params.getModifier("DROP_CHANCE") + 1;
            geodeChance *= sc.model.player.params.getModifier("EL_GEODE_FINDER") + 1;
            geodeChance *= sc.model.getCombatRankDropRate();
            geodeChance *= sc.newgame.getDropRateMultiplier();

            if(Math.random() <= geodeChance){
                sc.ItemDropEntity.spawnDrops(enemyEntity, ig.ENTITY_ALIGN.CENTER, ig.game.playerEntity, itemAPI.customItemToId["el-item-geode"], 1, sc.ITEM_DROP_TYPE.ENEMY)
            }
        }
    }
})
}
