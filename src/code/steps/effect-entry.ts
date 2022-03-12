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
            switch (this.mode) {
                case "hp":
                    this.color = getColorFromPercent(120, 0, sc.model.player.params.getHpFactor())
                    break;
                case "sp":
                    this.color = getColorFromPercent(180, 285, sc.model.player.params.getRelativeSp())
                    break;
            }
            this.parent(entity)
        }
    })
}