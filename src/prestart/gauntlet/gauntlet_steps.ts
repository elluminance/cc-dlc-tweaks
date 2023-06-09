el.GauntletStepBase = ig.Class.extend({
    advanceRoundNumber: false,
    next: null,

    start() {},
    canAdvanceRound() {
        //assumes a step that does not override run doesn't need to wait.
        return true;
    }
})

//@ts-expect-error
el.GAUNTLET_STEP = {};

el.GAUNTLET_STEP.SIMPLE_ENEMY_ROUND = el.GauntletStepBase.extend({
    advanceRoundNumber: true,

    enemies: [],
    level: 0,
    toKill: 0,
    //numKilled: 0,

    init(settings) {
        this.enemies = ig.copy(settings.enemies);
        this.level = settings.level;

        this.toKill = this.enemies.length;
    },

    start() {
        for(let enemy of this.enemies) {
            el.gauntlet.spawnEnemy(enemy, this.level, true);
        }
    },

    canAdvanceRound() {
        return el.gauntlet.getRoundEnemiesDefeated() >= this.toKill;
    }
})