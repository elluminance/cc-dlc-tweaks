// note: runs in poststart!

export const snowgraveKey = "EL_SNOWGRAVE";

export const isSnowgraveEquipped = () => sc.model.player.getActiveCombatArt(sc.ELEMENT.COLD, "ATTACK_SPECIAL3").name == snowgraveKey

export const getSnowgraveCost = () => sc.model.player.params.getModifier("EL_TRANCE") ? 16 : 32

export default function () {
    sc.StatusViewCombatArtsEntry.inject({
        init(artLevel, action) {
            this.parent(artLevel, action);
            if (action.key === snowgraveKey) {
                this.sp.setMaxNumber(99);
                this.sp.setNumber(getSnowgraveCost());
                this.sp.hook.pos.x -= 3;
            }
        }
    })

    sc.StatusViewCombatArtsCustomEntry?.inject({
        init(artLevel, action, icon) {
            this.parent(artLevel, action, icon);
            if (action.key === snowgraveKey) {
                this.sp.setMaxNumber(99);
                this.sp.setNumber(getSnowgraveCost());
                this.sp.hook.pos.x -= 3;
            }
        }
    })

    ig.ENTITY.Player.inject({
        getMaxChargeLevel(actionKey) {
            let maxCharge = this.parent(actionKey);
            if (maxCharge === 3
                && this.model.currentElementMode === sc.ELEMENT.COLD
                && isSnowgraveEquipped()
                && this.params.getSp() < getSnowgraveCost()
                && actionKey.actionKey == "ATTACK_SPECIAL"
            ) {
                console.log("snowgrave is equipped, not enough sp")
                maxCharge = 2;
            }
            return maxCharge;
        },

        showChargeEffect(level) {
            this.parent(level);

            if (this.charging.type.actionKey == "ATTACK_SPECIAL"
                && level === 3
                && this.model.currentElementMode === sc.ELEMENT.COLD
                && isSnowgraveEquipped()
            ) {
                this.params.notifySpConsume(getSnowgraveCost());
            }
        },

        getChargeAction(chargeType, level) {
            let key = this.parent(chargeType, level);
            if(key == snowgraveKey) {
                sc.newgame.get("infinite-sp") || this.params.consumeSp(getSnowgraveCost() - 6)
            }
            return key;
        }
    })
}
