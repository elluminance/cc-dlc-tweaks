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