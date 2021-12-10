/*
* turns out there's no easy way to change an enemy target to an arbitrary entity via action steps.
* there is an event step! but not an action step. y'know... the place that this would be useful.
* oh well, whatever will you do?
* (the answer is do it yourself.)
*/

ig.ACTION_STEP.EL_SET_TARGET = ig.ActionStepBase.extend({
    init: function(a: any) {
        this.name = a.name
    },
    //@ts-ignore
    start: function(a: any): void {
        a.setTarget(ig.game.getEntityByName(this.name!) || null)
    }
})

ig.ACTION_STEP.EL_SET_TARGET_POS = ig.ActionStepBase.extend({
    newPos: null,
    random: false,
    randRange: null,
    init(a: any) {
        this.newPos = a.newPos
        this.random = a.random || false
        this.randRange = a.randRange || {x: 0, y: 0}
    },
    //@ts-ignore
    start(a: any) {
        let pos = this.newPos;
        if(this.random){
            pos!.x += Math.round((Math.random() * this.randRange!.x * 2) - this.randRange!.x);
            pos!.y += Math.round((Math.random() * this.randRange!.y * 2) - this.randRange!.y);
        }
        let target = a.getTarget(),
            b = ig.Action.getVec3(pos!, target!, Vec3.createC(0, 0, 0)),
            c = target.coll;

        target.setPos(b.x - c.size.x / 2, b.y - c.size.y / 2, b.z);
    }
})
