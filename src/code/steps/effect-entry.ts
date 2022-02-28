export default function() {
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
}