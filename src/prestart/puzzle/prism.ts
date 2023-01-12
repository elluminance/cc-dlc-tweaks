import { Vec3ToTuple } from "../../helper-funcs.js";

export {};

let vec2_tmp = Vec2.create();
let vec3_tmp = Vec3.create();

const enum PrismState {
    NORMAL,
    GLOW,
}

const attackFactor = 2/3;
ig.ENTITY.EL_Prism = ig.AnimatedEntity.extend({
    timer: 0,
    angle: Math.PI / 4,
    state: PrismState.NORMAL,
    animTimer: 0,
    animIndex: 0,
    hoverTimer: 0,
    condition: null,

    active: true,

    effects: {
        puzzle: new ig.EffectSheet("puzzle.el-rhombus-lab"),
    },
    gfx: new ig.Image("media/entity/objects/el-rhombus-lab-puzzle.png"),

    init(x, y, z, settings) {
        this.parent(x, y, z, settings);

        this.coll.type = ig.COLLTYPE.VIRTUAL;
        this.coll.weight = -1;
        this.coll.zGravityFactor = 1E3;
        this.coll.setSize(16, 16, 16);
        this.coll.setPadding(2, 2);

        this.condition = new ig.VarCondition(settings.condition);
        this.active = this.condition.evaluate();
    },

    ballHit(entity) {
        if (!this.active) return false;

        if(entity instanceof ig.ENTITY.Ball && entity.isBall && entity.el_prism.timer <= 0) {
            let attackInfo = ig.copy(entity.attackInfo);
            if(attackInfo.hasHint("NO_PUZZLE")) return false;
            attackInfo.damageFactor *= attackFactor;
            attackInfo.spFactor *= attackFactor;
            attackInfo.statusInflict *= attackFactor;
            
            let rootBall = entity.el_prism.rootBall || entity;
            
            let baseEntity = entity.getCombatantRoot() as sc.PlayerBaseEntity;
            let proxy = sc.PlayerConfig.getElementBall(
                baseEntity,
                entity.getElement(),
                entity.attackInfo.hasHint("CHARGED")
            )

            let ball: ig.ENTITY.Ball;
            let pos = Vec3ToTuple(Vec3.addC(this.coll.pos, this.coll.size.x / 2, this.coll.size.y / 2, 0, vec3_tmp));
            
            for(let i of [-1, 1]) {
                Vec2.rotate(entity.coll.vel, i * this.angle, vec2_tmp);
                ball = proxy.spawn(...pos, baseEntity, vec2_tmp) as ig.ENTITY.Ball;
                ball.el_prism.timer = 0.1;
                ball.el_prism.rootBall = rootBall;
                entity.el_prism.children.push(ball);
                ball.remainingHits = entity.remainingHits;
                ball.timer = entity.timer;
                ball.attackInfo = attackInfo;
            }

            this.effects.puzzle.spawnOnTarget("prismGlow", this);

            this.state = PrismState.GLOW;
            this.timer = 0.2;
            return true;
        }
    },

    initSprites() {
        this.setSpriteCount(2);
    },

    update() {
        this.timer -= ig.system.tick;
        this.animTimer -=  ig.system.tick;
        this.hoverTimer += ig.system.tick;

        if(this.animTimer <= 0) {
            this.animIndex += 1;
            this.animIndex %= 4;

            this.animTimer += this.state == PrismState.GLOW ? 0.05 : 0.2;
        }

        if(this.timer <= 0) {
            this.state = PrismState.NORMAL;
        }
    },
    
    updateSprites() {
        let baseSprite = this.sprites[0];
        let prismSprite = this.sprites[1];
        const coll = this.coll;
        //this.sprites[1].setPos()
        baseSprite.setEntityDefault(this, 16, 32, "NO_EXPAND", 1, null, this.gfx, 80, 0);
        baseSprite.setShadow(0,0,0,0);

        Vec3.assignC(vec3_tmp, 0, 0, (1.5 * Math.sin(2 * this.hoverTimer)) + 7.5);

        if(this.active) {
            prismSprite.setEntityDefault(this, 16, 16, "NO_EXPAND", 1, vec3_tmp, this.gfx, 16 * this.animIndex, this.state == PrismState.GLOW ? 16 : 0);
            prismSprite.setShadow(
                coll.pos.x + coll.size.x / 2,
                coll.pos.y + coll.size.y / 2,
                coll.baseZPos,
                14 - (2 * Math.sin(2 * this.hoverTimer)),
            );
        } else {
            prismSprite.setInvisible();
        }
    },

    varsChanged() {
        this.active = this.condition.evaluate();
    },

    isBallDestroyer() {
        return this.active;
    }
})

ig.ENTITY.ElementPole.inject({
    ballHit(ball) {
        let parent = this.parent(ball);

        if(parent && ball.el_prism.rootBall) {
            for(const child of ball.el_prism.rootBall.el_prism.children) {
                child.destroy();
            }
        }
        return parent;
    }
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