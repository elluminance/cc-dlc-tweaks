export default function () {
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
            if(target) {
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
            let target = !index ? ig.game.playerEntity : sc.party.getPartyMemberEntityByIndex(index-1);
            entity.tmpTarget = target;
        }
    })

    ig.ACTION_STEP.ADD_ARENA_SCORE = ig.ActionStepBase.extend({
        scoreType: null,

        init(settings) {
            this.scoreType = settings.scoreType;
        },

        start() {
            if(this.scoreType) sc.arena.addScore(this.scoreType);
        }
    })

    ig.ACTION_STEP.SET_ENEMY_LEVEL = ig.ActionStepBase.extend({
        level: null,

        init(settings) {
            this.level = settings.level;
        },

        start(entity) {
            if(!(entity instanceof ig.ENTITY.Enemy)) {
                ig.warn("Cannot set level of non-enemy");
                return;
            }
            
            let level = ig.Event.getExpressionValue(this.level) as number | undefined;
            
            entity.setLevelOverride(level);
        }
    })
}