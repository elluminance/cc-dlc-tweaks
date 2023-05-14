el.GAUNTLET_MESSAGE = {
    CHANGED_STATE: 0
}

const DEFAULT_RUNTIME = {
    curPoints: 0,
    totalPoints: 0,
    curXp: 0,
} as const;

el.GauntletController = ig.GameAddon.extend({
    runtime: null,
    active: true,

    init() {
        this.parent("el-Gauntlet");
        this.runtime = {...DEFAULT_RUNTIME};
    },
})

ig.addGameAddon(() => (el.gauntlet = new el.GauntletController));