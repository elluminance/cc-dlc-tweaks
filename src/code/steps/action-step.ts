export default function () {
    ig.ACTION_STEP.EL_SET_TARGET_POS = ig.ActionStepBase.extend({
        newPos: null,
        random: false,
        randRange: null,
        init(a) {
            this.newPos = a.newPos
            this.random = a.random || false
            this.randRange = a.randRange || { x: 0, y: 0 }
        },

        start(entity) {
            let target = entity.getTarget(),
                pos = this.newPos;
            if(target) {
                if (this.random) {
                    pos.x += Math.round((Math.random() * this.randRange.x * 2) - this.randRange.x);
                    pos.y += Math.round((Math.random() * this.randRange.y * 2) - this.randRange.y);
                }
                let b = ig.Action.getVec3(pos, target, Vec3.createC(0, 0, 0)),
                    c = target.coll;
                target.setPos(b.x - c.size.x / 2, b.y - c.size.y / 2, b.z);
            }
        }
    })
}