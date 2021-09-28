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
                if(sc.model.player.getToggleItemState("el-toggle-one-hit-die")) return true
            case "disable-exp":
                if(sc.model.player.getToggleItemState("el-toggle-no-xp")) return true
        };
        return this.parent(b)
    }
})

//skin effect related

function getSpecialColorHSV(hueAtMax, hueAtMin, rotPercent) {
    let newHue = Math.min(hueAtMin, hueAtMax) + Math.abs(hueAtMax - hueAtMin) * rotPercent
    
    function hueToRGBValue(hue){
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