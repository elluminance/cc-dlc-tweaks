import { getColorFromPercent } from "../../helper-funcs.js"

export default function () {
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
            }
            this.parent(entity)
        }
    })
}