// note: runs in poststart!
export default function () {
    const snowgraveKey = "EL_SNOWGRAVE";

    sc.StatusViewCombatArtsEntry.inject({
        init(artLevel, action) {
            this.parent(artLevel, action);
            if (action.key === snowgraveKey) {
                this.sp.setMaxNumber(99);
                this.sp.setNumber(32);
                this.sp.hook.pos.x -= 3;
            }
        }
    })

    sc.StatusViewCombatArtsCustomEntry?.inject({
        init(artLevel, action, icon) {
            this.parent(artLevel, action, icon);
            if (action.key === snowgraveKey) {
                this.sp.setMaxNumber(99);
                this.sp.setNumber(32);
                this.sp.hook.pos.x -= 3;
            }
        }
    })

    ig.ENTITY.Player.inject({
        getMaxChargeLevel(actionKey) {
            let value = this.parent(actionKey);
            if (value === 3 && this.model.currentElementMode === sc.ELEMENT.COLD && "") {
            }
            return value;
        }
    })
}