import { getColorFromPercent, hsv2rgbString, rgbToString } from "../../helper-funcs.js"

export default function () {
    ig.ENTITY.Player.inject({
        // this value will get controlled by the modified COPY_SPRITE below
        auraColorStep: 0,
    })
    
    const rainbowIncrement = 5;

    ig.EFFECT_ENTRY.COPY_SPRITE_SPECIAL_COLOR_EL = ig.EFFECT_ENTRY.COPY_SPRITE.extend({
        mode: null,
        init(type, settings) {
            //@ts-expect-error
            this.parent(type, settings);
            this.mode = settings.mode
        },

        start(entity) {
            let playerEntity = ig.game.playerEntity,
                playerModel = sc.model.player;
            switch (this.mode) {
                case "hp":
                    this.color = getColorFromPercent(120, 0, playerModel.params.getHpFactor())
                    break;
                case "sp":
                    this.color = getColorFromPercent(180, 285, playerModel.params.getRelativeSp())
                    break;
                // this is absolutely not inspired by anything, nope not at all
                case "dash": 
                    let {dashCount, maxDash} = playerEntity

                    if (dashCount > maxDash || maxDash == 0) this.color = "#00beff";
                    else if (maxDash == 1 && dashCount == 1) this.color = "#ff0000";
                    else this.color = getColorFromPercent(300, 360, dashCount / maxDash)
                    break;
                case "customColor":
                    let color: sc.EL_ModalColorPicker.Color = ig.vars.get("el.colors.customAura") as any
                    if(color) this.color = rgbToString(color.red, color.green, color.blue);
                    else this.color = "#fff"
                    break;
                case "rainbow":
                case "pastel-rainbow":
                    // make sure it is always divisible by rainbowIncrement
                    if(playerEntity.auraColorStep % rainbowIncrement) playerEntity.auraColorStep = 0;
                    this.color = hsv2rgbString(playerEntity.auraColorStep, this.mode == "pastel-rainbow" ? 0.5 : 1, 1);
                    playerEntity.auraColorStep = (playerEntity.auraColorStep + rainbowIncrement) % 360;
                    break;
            }
            this.parent(entity)
        }
    })
}