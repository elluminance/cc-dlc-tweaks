export {};
//let vec2_tmp = Vec2.create();
let vec3_tmp = Vec3.create();
let vec3_tmp2 = Vec3.create();


function updatePrism(entity: ig.ENTITY.EL_Prism, prism: ig.CubeSprite) {
    prism.setEntityDefault(
        entity,
        16, 16, //tile w/h
        "NO_EXPAND",
        1,
        vec3_tmp, 
        entity.gfx,
        16 * entity.animIndex,
        0
    );
}

const glowTime = 0.33;
const glowMult = 1 / glowTime;

ig.ENTITY.EL_Prism = ig.AnimatedEntity.extend({
    glowTimer: 0,
    glowColor: "#FFFFFF",
    angle: Math.PI / 4,
    animTimer: 0,
    animIndex: 0,
    hoverTimer: 0,
    condition: null,
    forceHidePrism: false,
    lightHandle: null,

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

        if(!this.active) this.forceHidePrism = true;
    },

    ballHit(entity) {
        if (!this.active || this.cooldown > 0) return false;

        if(!entity.el_prism) return false;

        if(entity.el_prism.timer >= 0 && entity.el_prism.lastPrism === this) {
            entity.el_prism.timer = Math.max(0.1, entity.el_prism.timer);
            return false;
        }
        //@ts-expect-error
        if(entity.attackInfo?.hasHint("NO_PUZZLE")) return false;

        this._splitEntity(entity);
        entity.postPrismSplit?.(this);
        return true;
    },

    _splitEntity(entity) {
        let entities: (typeof entity)[] = [];

        let pos = Vec3.addC(this.coll.pos, this.coll.size.x / 2, this.coll.size.y / 2, 0, vec3_tmp);
        pos.z = entity.coll.pos.z;
        let vel = vec3_tmp2;
        

        let spawnFunc = entity.prismSpawnFunc?.bind(entity) ?? ((prism, pos, vel) => ig.game.spawnEntity(
            entity.constructor as (new (x: number, y: number, z: number, settings: unknown) => typeof entity),
            pos.x, pos.y, pos.z
        ));
        for(let i of [1, -1]) {
            Vec3.assign(vel, entity.coll.vel)
            Vec2.rotate(vel, i * this.angle);

            let spawned = spawnFunc(this, pos, vel); 

            spawned.el_prism.timer = 0.25;
            spawned.el_prism.lastPrism = this;
            spawned.el_prism.rootEntity = entity.el_prism.rootEntity ?? entity;
            spawned.el_prism.children = entity.el_prism.children;
            spawned.el_prism.directRoot = entity;

            entity.el_prism.children.push(spawned);
            entity.el_prism.directChildren.push(spawned);
            Vec3.assign(spawned.coll.vel, vel);
            
            for(let attached of entity.entityAttached) spawned.addEntityAttached(attached);
            
            entities.push(spawned);
            spawned.onPrismSpawn?.(this, entity);
        }

        this.effects.puzzle.spawnOnTarget("prismGlow", this);

        this.glowTimer = glowTime;
        this.glowColor = entity.getPrismGlowColor?.() ?? "#FFFFFF";
        //this.cooldown = 0.1;

        return entities;
    },

    initSprites() {
        this.setSpriteCount(2);

        if(!this.active) {
            this.sprites[1].setInvisible();
        }
    },

    update() {
        this.glowTimer -= ig.system.tick;
        this.animTimer -=  ig.system.tick;
        this.hoverTimer += ig.system.tick;
        this.cooldown -= ig.system.tick;
        
        if(this.animTimer <= 0) {
            this.animIndex += 1;
            this.animIndex %= 4;
            
            this.animTimer += (this.glowTimer > 0) ? 0.05 : 0.2;
        }

        if(this.active) {
            this.coll.type = ig.COLLTYPE.VIRTUAL;
            if(!this.lightHandle) {
                this.lightHandle = new ig.LightHandle(this, ig.LIGHT_SIZE.M, 0.1, 0.3, -1, 1, false);                
                this.lightHandle.setOffset(0, 6, 0);
                ig.light.addLightHandle(this.lightHandle);
            }
        } else {
            this.coll.type = ig.COLLTYPE.IGNORE;
            if(this.lightHandle) {
                this.lightHandle.stop();
                this.lightHandle = null;
            }
        }
    },
    
    updateSprites() {
        let baseSprite = this.sprites[0];
        let prismSprite = this.sprites[1];
        const coll = this.coll;

        baseSprite.setEntityDefault(this, 16, 32, "NO_EXPAND", 1, null, this.gfx, 80, 0);
        baseSprite.setShadow(0,0,0,0);
        
        if(this.active) {
            Vec3.assignC(vec3_tmp, 0, 0, (1.5 * Math.sin(2 * this.hoverTimer)) + 7.5);
            updatePrism(this, prismSprite);
            prismSprite.setShadow(
                coll.pos.x + coll.size.x / 2,
                coll.pos.y + coll.size.y / 2,
                coll.baseZPos,
                14 - (2 * Math.sin(2 * this.hoverTimer)),
            );

            prismSprite.setLighterOverlayColor(this.glowColor, Math.max(this.glowTimer * glowMult, 0))
        }
        
        if(this.forceHidePrism) {
            this.forceHidePrism = false;
            this.sprites[1].setInvisible();
        }
    },

    varsChanged() {
        let isActive = this.condition.evaluate();

        if(isActive !== this.active) {
            this.active = isActive;
            if(this.active) {
                updatePrism(this, this.sprites[1]);

                this.effects.puzzle.spawnOnTarget("showPrism", this, {
                    spriteFilter: [1]
                })

            } else {
                this.effects.puzzle.spawnOnTarget("hidePrism", this, {
                    spriteFilter: [1]
                })
                this.sprites[1].setShadow(0,0,0,0);
            }
        }
    },

    isBallDestroyer() {
        return this.active;
    }
})
