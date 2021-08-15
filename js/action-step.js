/*
 * turns out there's no easy way to change an enemy target to an arbitrary entity via action steps.
 * there is an event step! but not an action step. y'know... the place that this would be useful.
 * oh well, whatever will you do?
 * (the answer is do it yourself.)
 */

ig.ACTION_STEP.EL_SET_TARGET = ig.ActionStepBase.extend({
    init: function(a) {
        this.name = a.name
    },
    start: function(a) {
        a.setTarget(ig.game.getEntityByName(this.name) ?? null)
    }
})

ig.ACTION_STEP.EL_SET_TARGET_POS = ig.ActionStepBase.extend({
    newPos: null,
    init(a) {
        this.newPos = a.newPos
    },
    start(a) {
        let target = a.getTarget(),
            b = ig.Action.getVec3(this.newPos, target, Vec3.createC(0, 0, 0)),
            c = target.coll;

        target.setPos(b.x - c.size.x / 2, b.y - c.size.y / 2, b.z);
    }
})
