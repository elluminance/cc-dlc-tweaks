export {};


ig.ACTION_STEP.EL_SET_TARGET_POS = ig.ActionStepBase.extend({
    newPos: null,
    random: false,
    randRange: null,
    init(a) {
        this.newPos = a.newPos
        this.random = a.random || false
        this.randRange = a.randRange || { x: 0, y: 0 }
    },

    start(entity) {
        let target = entity.getTarget(),
            pos = this.newPos;
        if (target) {
            if (this.random) {
                pos.x += Math.round((Math.random() * this.randRange.x * 2) - this.randRange.x);
                pos.y += Math.round((Math.random() * this.randRange.y * 2) - this.randRange.y);
            }
            let b = ig.Action.getVec3(pos, target, Vec3.createC(0, 0, 0)),
                c = target.coll;
            target.setPos(b.x - c.size.x / 2, b.y - c.size.y / 2, b.z);
        }
    }
});

ig.ACTION_STEP.EL_SET_PARTY_TEMP_TARGET_BY_INDEX = ig.ActionStepBase.extend({
    init(settings) {
        this.value = settings.value;
    },
    start(entity) {
        let index = ig.Event.getExpressionValue(this.value) as number;
        let target = !index ? ig.game.playerEntity : sc.party.getPartyMemberEntityByIndex(index - 1);
        entity.tmpTarget = target;
    }
})

ig.ACTION_STEP.SET_TEMP_TARGET.CustomTargetFunctions ??= {}

let vec3_tmp = Vec3.create();
let vec2_tmp = Vec2.create();

ig.ACTION_STEP.SET_TEMP_TARGET.CustomTargetFunctions["NEARBY_ALLY"] = (combatant) => {
    let entityPos = combatant.getAlignedPos(ig.ENTITY_ALIGN.BOTTOM, vec3_tmp);
    let c = Math.PI * 0.5;
    let entities = ig.game.getEntitiesInCircle(entityPos, ig.system.width / 2, 1, 32, combatant.face, -c / 2, c / 2, combatant)
    let d = 0;
    let e = entities.length;
    let curClosestEntity: ig.ENTITY.Combatant | null = null;
    for (; e--;) {
        let f = entities[e];
        if ((f instanceof ig.ENTITY.Combatant) && f.party === (combatant as ig.ENTITY.Combatant).party) {
            let g = ig.CollTools.getDistVec2(combatant.coll, f.coll, vec2_tmp),
                h = Vec2.angle(combatant.face, g),
                len = Vec2.length(g) + h * 1E3;
            if (!curClosestEntity || len < d) {
                curClosestEntity = f;
                d = len
            }
        }
    }
    return curClosestEntity!
}
ig.ACTION_STEP.SET_TEMP_TARGET.inject({
    init(settings) {
        this.parent(settings);

        if (settings.kind in ig.ACTION_STEP.SET_TEMP_TARGET.CustomTargetFunctions) {
            this.kind = ig.ACTION_STEP.SET_TEMP_TARGET.CustomTargetFunctions[settings.kind];
        }
    }
})

ig.ACTION_STEP.ADD_ARENA_SCORE = ig.ActionStepBase.extend({
    scoreType: null,

    init(settings) {
        this.scoreType = settings.scoreType;
    },

    start() {
        if (this.scoreType) sc.arena.addScore(this.scoreType);
    }
})

ig.ACTION_STEP.SET_ENEMY_LEVEL = ig.ActionStepBase.extend({
    level: null,

    init(settings) {
        this.level = settings.level;
    },

    start(entity) {
        if (!(entity instanceof ig.ENTITY.Enemy)) {
            ig.warn("Cannot set level of non-enemy");
            return;
        }

        let level = ig.Event.getExpressionValue(this.level) as number | undefined;

        entity.setLevelOverride(level);
    }
})