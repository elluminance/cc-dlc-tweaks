el.GauntletStepBase = ig.Class.extend({
    isProperRound: false,
    next: null,

    start() {},
    canAdvanceRound() {
        //assumes a step that does not override this doesn't need to wait.
        return true;
    },

    //do not override this! override getBranch if you need to!
    nextStep() {
        return [this.next, this.getBranch?.()];
    },
})

//@ts-expect-error
el.GAUNTLET_STEP = {};

el.GAUNTLET_STEP.SIMPLE_ENEMY_ROUND = el.GauntletStepBase.extend({
    isProperRound: true,

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

//#region Entity Manipulation
const vec3_temp = Vec3.create();
//intended for things such as puzzle elements that are needed to defeat enemies.
el.GAUNTLET_STEP.SPAWN_ENTITIES = el.GauntletStepBase.extend({
    entities: [],

    init(settings) {
        this.entities = settings.entities;
    },

    start() {
        for(const entity of this.entities) {
            let marker = entity.marker ? ig.game.getEntityByName(entity.marker) : undefined;

            if(marker) {
                Vec3.assign(vec3_temp, marker.coll.pos)
            } else {
                Vec3.assignC(vec3_temp, 0, 0, 0);
            }

            Vec3.add(vec3_temp, entity.offPos || {x: 0, y: 0, z: 0});

            ig.game.spawnEntity(entity.type, vec3_temp.x, vec3_temp.y, vec3_temp.z, entity.settings)
        }
    }
})

el.GAUNTLET_STEP.KILL_ENTITIES = el.GauntletStepBase.extend({
    entities: [],

    init(settings) {
        for(let entity of settings.entities) {
            if(typeof entity == "string") {
                this.entities.push({
                    name: entity,
                    killEffect: null
                })
            } else {
                this.entities.push({
                    name: entity.name,
                    killEffect: entity.killEffect ? new ig.EffectHandle(entity.killEffect) : null,
                })
            }
        }
    },

    start() {
        for(let entityData of this.entities) {
            let callback = {
                onEffectEvent(effect: ig.ENTITY.Effect) {
                    if(effect.isDone()) entity.kill()
                }
            }
            let entity = ig.game.getEntityByName(entityData.name);

            if(entityData.killEffect) {
                entityData.killEffect.spawnOnTarget(entity, {callback});
            } else {
                ig.game.effects.teleport.spawnOnTarget("hideDefault", entity, {callback});
            }
        }
    },
})
//#endregion

//#region Functions
el.GauntletFunction = ig.Class.extend({
    init(steps) {
        this.steps = steps;
    }
})

el.GAUNTLET_STEP.CALL_FUNCTION = el.GauntletStepBase.extend({
    init(settings) {
        this.name = settings.name
    },

    getBranch() {
        if(!(this.name in this.cup.functions)) throw Error(`Function ${this.name} not found.`)
        return this.cup.functions[this.name].steps[0];
    },
})
//#endregion
