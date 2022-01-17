//#region booster

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
                enemy.setLevelOverride(sc.newgame.get("scale-enemies") ? sc.model.player.getParamAvgLevel(10) : ascendedLevel)
                enemy.boosterState = sc.ENEMY_BOOSTER_STATE.BOOSTED;
            } else {
                enemy.boosterState = sc.ENEMY_BOOSTER_STATE.BOOSTABLE;
                this.ascendedBooster.skipCheck = true;
                this.parent(enemy) // just let the function set it to what it needs to be, ignoring the ascended booster 
                this.ascendedBooster.skipCheck = false;
            }
        }
    },

    modelChanged(source, message){
        if(source instanceof sc.PlayerModel && message == sc.PLAYER_MSG.LEVEL_CHANGE){
            this.ascendedBooster.forceCheck = true 
            this.updateBoosterState()
        }
        this.parent(source, message)
    }
})

sc.EnemyInfoBox.inject({
    setEnemy(b){
        const ascBooster = sc.model.player.getToggleItemState("dlctweaks-ascended-booster");
        this.parent(b);
        if(this.enemy && ascBooster && sc.combat.canShowBoostedEntry(b, this.enemy.boss)){
            this.level.setNumber(sc.enemyBooster.ascendedBooster.calcLevel(b))
        }
    }
})

sc.EnemyEntryButton.inject({
    init(b, a, d){
        let enemyType = sc.combat.enemyDataList[a];
        this.parent(b, a, d);
        if(d >= 0 && sc.model.player.getToggleItemState("dlctweaks-ascended-booster") && sc.combat.canShowBoostedEntry(a, enemyType.boss)) {
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

//#endregion booster


// special toggle sets
sc.NewGamePlusModel.inject({
    get(b) {
        switch(b){
            case "lea-must-die":
                if(sc.model.player.getToggleItemState("el-toggle-one-hit-die")) return true
            case "disable-exp":
                if(sc.model.player.getToggleItemState("el-toggle-no-xp")) return true
        };
        return this.parent(b)
    }
})

//skin effect related

function getSpecialColorHSV(hueAtMax: number, hueAtMin: number, rotPercent: number): string {
    let newHue = Math.min(hueAtMin, hueAtMax) + Math.abs(hueAtMax - hueAtMin) * rotPercent
    
    function hueToRGBValue(hue: number){
        hue = (hue + 360) % 360;
        let color = 0;
        if(hue < 60) color = (1/4) * hue
        else if(hue >= 60 && hue <= 180) color = 15;
        else if(hue >= 180 && hue <= 240) color = 60 - (1/4) * hue
        return color
    }

    let red = Math.floor(hueToRGBValue(newHue + 120))
    let green = Math.floor(hueToRGBValue(newHue))
    let blue = Math.floor(hueToRGBValue(newHue - 120))
    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
}

declare namespace ig.EFFECT_ENTRY{
    interface COPY_SPRITE_SPECIAL_COLOR_EL extends EffectStepBase, EffectSettings{
        init(this: this, type: any, settings: ig.EFFECT_ENTRY.EffectSettings): void
    }

    interface COPY_SPRITE_SPECIAL_COLOR_EL_CONSTRUCTOR extends ImpactClass<COPY_SPRITE_SPECIAL_COLOR_EL> {}

    var COPY_SPRITE_SPECIAL_COLOR_EL: COPY_SPRITE_SPECIAL_COLOR_EL_CONSTRUCTOR
}

ig.EFFECT_ENTRY.COPY_SPRITE_SPECIAL_COLOR_EL = ig.EffectStepBase.extend({
    particleData: null,
    mode: null,
    colorAlpha: 1,
    offset: {
        x: 0,
        y: 0,
        z: 0
    },
    init(type, settings) {
        this.particleData = ig.EffectConfig.loadParticleData(null, settings, type?.cacheKey);
        this.particleData.particleDuration = this.particleData.particleDuration || 1;
        this.mode = settings.mode || null; 
        this.colorAlpha = settings.colorAlpha || 1;
        this.fadeColor = settings.fadeColor || null;
        this.offset = settings.offset || this.offset;
        this.noLighter = settings.noLighter || false
    },
    start(entity) {
        let color = "#FFF";
        switch(this.mode){
            case "hp":
                color = getSpecialColorHSV(120, 0, sc.model.player.params.getHpFactor())
                break;
            case "sp":
                color = getSpecialColorHSV(210, 285, sc.model.player.params.getRelativeSp())
                break;
        }
        entity.spawnParticle(ig.ENTITY.CopyParticle, null, {
            entity: entity.target,
            color,
            fadeColor: this.fadeColor,
            colorAlpha: this.colorAlpha,
            data: this.particleData,
            offset: this.offset,
            spriteFilter: entity.spriteFilter,
            noLighter: this.noLighter
        })
    }
})

ig.EffectSheet.inject({
    spawnFixed(effectName, x, y, z, target, effectSettings) {
        if(this.path === "combatant" && effectName === "boom_medium" && sc.model.player.getToggleItemState("el-toggle-dr-explosion")) {
            effectName = "boom_medium_deltarune"
        }
        return this.parent(effectName, x, y, z, target, effectSettings)
    }
})
