import { Vec3ToTuple } from "../../helper-funcs.js";

export {};

let vec2_tmp = Vec2.create();

const enum PrismState {
    NORMAL,
    POST_HIT,
}

ig.ENTITY.EL_Prism = ig.AnimatedEntity.extend({
    ballDestroyer: true,
    timer: 0,
    angle: Math.PI / 4,
    state: PrismState.NORMAL,
    effects: {
        puzzle: new ig.EffectSheet("puzzle.el-rhombus-lab"),
    },

    init(x, y, z, settings) {
        this.parent(x, y, z, settings);
        this.coll.type = ig.COLLTYPE.VIRTUAL;
        this.coll.weight = -1;
        this.coll.zGravityFactor = 1E3;
        this.coll.setSize(16, 16, 16);
        this.coll.setPadding(2, 2);
        this.initAnimations({
            sheet: {
                src: "media/entity/objects/el-rhombus-lab-puzzle.png",
                width: 16,
                height: 32,
                xCount: 5,

                offX: 0,
                offY: 0,
            },
            size: {
                x: 16,
                y: 16,
                z: 16
            },
            SUB: [{
                name: "off",
                time: 0.2,
                frames: []
            }, {
                name: "normal",
                time: 0.2,
                frames: [4],
                repeat: true,
                globalTiming: true
            }, {
                name: "glow",
                time: 0.04,
                repeat: true,
                frames: [4, 5, 6, 7],
                globalTiming: true
            }]
        });

        this.setCurrentAnim("normal")
    },

    ballHit(entity) {
        if(entity instanceof ig.ENTITY.Ball && entity.isBall && entity.el_prism.timer <= 0) {
            let rootBall = entity.el_prism.rootBall || entity;

            let baseEntity = entity.getCombatantRoot() as sc.PlayerBaseEntity;
            let proxy = sc.PlayerConfig.getElementBall(
                baseEntity,
                entity.getElement(),
                entity.attackInfo.hasHint("CHARGED")
            )
            
            //todo: reduce damage factor
            //let attackInfo = entity.attackInfo;

            let ball: ig.ENTITY.Ball;
            let pos = Vec3ToTuple(this.coll.pos);
            
            for(let i of [-1, 1]) {
                Vec2.rotate(entity.coll.vel, i * this.angle, vec2_tmp);
                ball = proxy.spawn(...pos, baseEntity, vec2_tmp) as ig.ENTITY.Ball;
                ball.el_prism.timer = 0.1;
                ball.el_prism.rootBall = rootBall;
                entity.el_prism.children.push(ball);
                ball.remainingHits = entity.remainingHits;
                ball.timer = entity.timer;
            }

            this.effects.puzzle.spawnOnTarget("prismGlow", this)
            return true;
        }
    },

    isBallAdjust() {
        return true;
    },
    doBallAdjust(...args) {console.log(args);}
})

let orig1 = sc.ElementPoleGroups.onPoleHit.bind(sc.ElementPoleGroups);
sc.ElementPoleGroups.onPoleHit = function(pole, ball, alreadyHit) {
    return orig1(pole, ball.el_prism.rootBall || ball, alreadyHit);
}
let orig2 = sc.ElementPoleGroups.onCancelCheck.bind(sc.ElementPoleGroups)
sc.ElementPoleGroups.onCancelCheck = function(pole) {
    let ball = this.getGroup(pole.group).currentBall;
    //let killStatus = true;
    let orig_killed = ball?._killed;
    if(ball && ball.el_prism.children.length > 0) {
        for(let child of ball.el_prism.children) {
            if(!child._killed) {
                ball._killed = false;
                break;
            }
        }
    }
    let val = orig2(pole);
    if(ball) ball._killed = orig_killed!;
    return val;
}

ig.ENTITY.Ball.inject({
    el_prism: {
        timer: 0,
        rootBall: null,
        children: []
    },
    update() {
        this.parent();
        this.el_prism.timer -= ig.system.tick;
    }
})