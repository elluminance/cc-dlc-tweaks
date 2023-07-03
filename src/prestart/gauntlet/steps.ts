ig.EVENT_STEP.START_EL_GAUNTLET = ig.EventStepBase.extend({
    start() {
        el.gauntlet.beginGauntlet();
    }
})

ig.EVENT_STEP.SHOW_GAUNTLET_LEVEL_UP = ig.EventStepBase.extend({
    start() {
        this.levelGui = el.gauntlet.levelUpGui;
        ig.gui.addGuiElement(this.levelGui);
        this.levelGui.show();
    },

    run() {
        return this.levelGui.done;
    },
})