ig.EVENT_STEP.START_EL_GAUNTLET = ig.EventStepBase.extend({
    start() {
        el.gauntlet.startNextRound();
    }
})