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
        this.enemies = settings.enemies;
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

el.GAUNTLET_STEP.CHANGE_VARS = el.GauntletStepBase.extend({
    vars: {},

    init(settings) {
        this.vars = settings.vars;
    },

    start() {
        for(let [key, val] of Object.entries(this.vars)) {
            ig.vars.set(key, ig.Event.getExpressionValue(val));
        }
    }
})

el.GAUNTLET_STEP.DEBUG_LOG = el.GauntletStepBase.extend({
    msg: null,

    init(settings) {
        this.msg = settings.msg.toString() || "";
    },

    start() {
        this.msg = this.msg.replace(/\\v\[([^\]]+)\]/g, (_match, g1) => ig.vars.get(g1));
        console.log("%cGAUNTLET_STEP.DEBUG_LOG%c: %s", "color: green", "color: initial", this.msg)
    },
})

el.GAUNTLET_STEP.DO_EVENT = el.GauntletStepBase.extend({
    event: null,

    init(settings) {
        this.event = new ig.Event({
            name: "GAUNTLET_EVENT",
            steps: settings.event,
        })
        this.isBlocking = settings.isBlocking || true;
    },

    start() {
        this.inEvent = this.isBlocking;
        ig.game.events.callEvent(
            this.event,
            this.isBlocking ? ig.EventRunType.BLOCKING : ig.EventRunType.PARALLEL,
            undefined,
            () => (this.inEvent = false)
        )
    },

    canAdvanceRound() {
        return !this.inEvent;
    },
})
