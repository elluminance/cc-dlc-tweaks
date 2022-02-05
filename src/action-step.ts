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
    start: function(target) {
        target.setTarget(ig.game.getEntityByName(this.name!) || null)
    }
})

ig.ACTION_STEP.EL_SET_TARGET_POS = ig.ActionStepBase.extend({
    newPos: null,
    random: false,
    randRange: null,
    init(a) {
        this.newPos = a.newPos
        this.random = a.random || false
        this.randRange = a.randRange || {x: 0, y: 0}
    },

    start(entity) {
        let pos = this.newPos;
        if(this.random){
            pos!.x += Math.round((Math.random() * this.randRange!.x * 2) - this.randRange!.x);
            pos!.y += Math.round((Math.random() * this.randRange!.y * 2) - this.randRange!.y);
        }
        let target = entity!.getTarget(),
            b = ig.Action.getVec3(pos!, target!, Vec3.createC(0, 0, 0)),
            c = target.coll;

        target.setPos(b.x - c.size.x / 2, b.y - c.size.y / 2, b.z);
    }
})

ig.ACTION_STEP.EL_ELEMENT_IF = ig.ActionStepBase.extend({
    branches: {},
    init() {},
    getBranchNames() {
        return ["neutral", "heat", "cold", "shock", "wave"]
    },
    getNext(entity) {
        switch(sc.combat.getElementMode(entity)) {
            case sc.ELEMENT.NEUTRAL:
                return this.branches.neutral
            case sc.ELEMENT.HEAT:
                return this.branches.heat
            case sc.ELEMENT.COLD:
                return this.branches.cold
            case sc.ELEMENT.SHOCK:
                return this.branches.shock
            case sc.ELEMENT.WAVE:
                return this.branches.wave
        }
    }
})

ig.ACTION_STEP.GOTO_LABEL_WHILE = ig.ActionStepBase.extend({
    name: "",
    condition: null,

    init(settings) {
        this.name = settings.name;
        this.condition = new ig.VarCondition(settings.condition);
    },

    getJumpLabelName() {
        return this.condition.evaluate() ? this.name : null;
    }
})