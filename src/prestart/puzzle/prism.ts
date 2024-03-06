import { Vec3ToTuple } from "../../helper-funcs.js";

export {};

let vec2_tmp = Vec2.create();
let vec3_tmp = Vec3.create();
let vec3_tmp2 = Vec3.create();

function ElementToColor(element: sc.ELEMENT) {
    switch(element) {
        case sc.ELEMENT.NEUTRAL: return "#666666";
        case sc.ELEMENT.HEAT: return "#FC6900";
        case sc.ELEMENT.COLD: return "#00D2FC";
        case sc.ELEMENT.SHOCK: return "#AA00FF";
        case sc.ELEMENT.WAVE: return "#00FF4C";
        default: return "#FFFFFF"
    }
}

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

const attackFactor = 2/3;
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

        if((!entity.el_prism) || (entity.el_prism.timer >= 0 && entity.el_prism.lastPrism === this)) {
            entity.el_prism.timer = Math.max(0.1, entity.el_prism.timer);
            return false;
        }

        if(entity instanceof ig.ENTITY.Ball) {
            let attackInfo = ig.copy(entity.attackInfo);
            if(attackInfo.hasHint("NO_PUZZLE")) return false;
            attackInfo.damageFactor *= attackFactor;
            attackInfo.spFactor *= attackFactor;
            attackInfo.statusInflict *= attackFactor;
            
            let baseEntity = entity.getCombatantRoot() as sc.PlayerBaseEntity;
            let proxy = sc.PlayerConfig.getElementBall(
                baseEntity,
                entity.getElement(),
                entity.attackInfo.hasHint("CHARGED")
            )

            this._splitEntity(
                entity,
                ElementToColor(entity.getElement()),
                ball => {
                    ball.remainingHits = entity.remainingHits;
                    ball.timer = entity.timer;
                    ball.attackInfo = attackInfo;
                },
                (pos, vel) => proxy.spawn(...Vec3ToTuple(pos), baseEntity, vel) as ig.ENTITY.Ball
            );

            return true;
        } else if(entity instanceof sc.CompressedBaseEntity) {
            this._splitEntity(entity, ElementToColor(entity.getElement()), spawned => {
                spawned.speedFactor = entity.speedFactor;
                spawned.fastMode = entity.fastMode;
                spawned.globalCount = entity.globalCount + 0.5;
                spawned.killTimer = entity.killTimer;
                spawned.combatant = entity.combatant;
                spawned.attackInfo = entity.attackInfo;

                if(entity instanceof sc.CompressedShockEntity) spawned.el_prism.timer *= 2;
            });

            for(let entity of ig.game.getEntitiesByType(sc.CompressedBaseEntity)) {
                entity.globalCount += 1;
            }

            entity.kill();
            return true;
        } else if(entity instanceof sc.IceDiskEntity) {
            this._splitEntity(entity, "#a4ebff", spawned => {
                spawned.slide(spawned.coll.vel, entity.combatant);
                spawned.timer = entity.timer;
                spawned.panel = entity.panel;
            });
            entity.kill();
        } else {
            console.log("uh oh - something else is trying to be split!");
            return false;
        }
    },

    _splitEntity(entity, glowColor, postSpawnCallback, spawnFunc) {
        let entities: (typeof entity)[] = [];

        let pos = Vec3.addC(this.coll.pos, this.coll.size.x / 2, this.coll.size.y / 2, 0, vec3_tmp);
        pos.z = entity.coll.pos.z;
        let vel = vec3_tmp2;
            
        for(let i of [1, -1]) {
            Vec3.assign(vel, entity.coll.vel)
            Vec2.rotate(vel, i * this.angle);

            let spawned: typeof entity;
            if(!spawnFunc) {
                spawned = ig.game.spawnEntity(
                    entity.constructor as (new (x: number, y: number, z: number, settings: unknown) => typeof entity),
                    ...Vec3ToTuple(pos)
                );
            }
            else spawned = spawnFunc(pos, vel); 

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
            if(postSpawnCallback) postSpawnCallback(spawned);
        }

        this.effects.puzzle.spawnOnTarget("prismGlow", this);

        this.glowTimer = glowTime;
        this.glowColor = glowColor;
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

ig.ENTITY.ElementPole.inject({
    ballHit(ball) {
        let parent = this.parent(ball);

        if(ball.getElement() === sc.ELEMENT.NEUTRAL) return parent;

        if(parent && ball.el_prism.rootEntity) {
            for(const child of ball.el_prism.rootEntity.el_prism.children) {
                child.destroy();
            }
        }
        return parent;
    }
})

let orig1 = sc.ElementPoleGroups.onPoleHit.bind(sc.ElementPoleGroups);
sc.ElementPoleGroups.onPoleHit = function(pole, ball, alreadyHit) {
    return orig1(pole, ball.el_prism.rootEntity || ball, alreadyHit);
}
let orig2 = sc.ElementPoleGroups.onCancelCheck.bind(sc.ElementPoleGroups)
sc.ElementPoleGroups.onCancelCheck = function(pole) {
    let ball = this.getGroup(pole.group).currentBall;
    //let killStatus = true;
    let orig_killed = ball?._killed;
    if(ball) {
        if(ball.el_prism.children.length > 0) {
            for(let child of ball.el_prism.children) {
                if(!child._killed) {
                    ball._killed = false;
                    break;
                }
            }
        }
    }

    let val = orig2(pole);
    if(ball) ball._killed = orig_killed!;
    return val;
}

function applyPrismData<T>(baseClass: T) {
    //@ts-expect-error
    baseClass.inject({
        el_prism: {
            timer: 0,
            rootEntity: null,
            children: [],
            //the children that specific ball is attached to, and their parent. 
            directChildren: [],
            directRoot: null,
        },
        init(...args: unknown[]) {
            this.parent(...args);
            this.el_prism.rootEntity = this;
        },
        update(...args: unknown[]) {
            this.parent(...args);
            this.el_prism.timer -= ig.system.tick;
        }
    })
}

applyPrismData(ig.ENTITY.Ball);
applyPrismData(sc.CompressedBaseEntity);
applyPrismData(sc.IceDiskEntity);

ig.ENTITY.Ball.inject({
    update() {
        this.parent();
        this.el_prism.timer -= ig.system.tick;
    }
})

ig.ENTITY.WavePushPullBlock.inject({
    ballAttached: null,
    lastTeleportPos: null,

    init(...args) {
        this.parent(...args);
        this.lastTeleportPos = Vec3.create();
    },

    update() {
        this.parent();

        // if(this.phased && this.ballAttached) {
        //     if(this.ballAttached.el_prism.children.length > 0 && !this.ballAttached.el_prism.children.find(x => !x._killed)) {
        //         this.phased = false;
        //         this.setCurrentAnim("default");
        //     }
        // }
    },

    ballHit(ball) {
        let phaseState = this.phased;
        if(!this.phased) {
            this.ballAttached = null;
        }
        let parent = this.parent(ball);

        if(!phaseState && this.phased) {
            this.ballAttached = ball;
        }

        return parent;
    },

    onEntityKillDetach() {
        let ball = this.ballAttached;
        
        let doParent = true;
        if(ball?.el_prism) {
            if(ball.el_prism.directChildren.find(x => !x._killed)) {
                doParent = false;
            }
        }

        if(doParent) {
            this.parent();
            this.ballAttached = null;
        }
    },

    doTeleport(portal) {
        this.el_lastSplitBlock?.disappear();
        this.el_lastSplitBlock = null;
        if(this.phased) {
            Vec3.assign(this.lastTeleportPos, this.coll.pos);
            this.parent(portal);
        } else {
            let entity = ig.game.spawnEntity(el.WavePushPullBlockPrismCopy, ...Vec3ToTuple(this.lastTeleportPos))
            this.el_lastSplitBlock = entity;
        }
    },

    resetPos(pos) {
        this.parent(pos);

        this.el_lastSplitBlock?.disappear();
    }
})

el.WavePushPullBlockPrismCopy = ig.ENTITY.PushPullBlock.extend({
    effects: {
        waveTeleport: new ig.EffectSheet("puzzle.wave-teleport"),
        rhombusPuzzle: new ig.EffectSheet("puzzle.el-rhombus-lab"),
    },

    init(x, y, z, settings) {
        this.parent(x, y, z, settings);

        this.coll.type = ig.COLLTYPE.BLOCK;
        this.coll.zGravityFactor = 1E3;
        this.coll.zBounciness = 0;
        this.coll.weight = -1;
        this.coll.shadow.size = 32;
        this.coll.setSize(32, 32, 32);

        let style = ig.mapStyle.get("waveblock_prismcopy");

        this.effects.waveTeleport.spawnOnTarget("show", this);
        this.initAnimations({
            sheet: {
                src: style.sheet,
                width: 32,
                height: 64,
                offX: style.x,
                offY: style.y
            },
            aboveZ: 1,
            SUB: [{
                name: "default",
                renderMode: "lighter",
                time: 1,
                frames: [0],
                repeat: false
            }, {
                name: "moveV",
                renderMode: "lighter",
                time: 0.03,
                frames: [0, 0],
                framesGfxOffset: [0, 0, 0, 0],
                repeat: true
            }, {
                name: "moveH",
                renderMode: "lighter",
                time: 0.03,
                frames: [0, 0],
                framesGfxOffset: [0, 0, 0, 0],
                repeat: true
            }]
        });
    },

    disappear() {
        this.effects.waveTeleport.spawnOnTarget("hide", this, {
            callback: {onEffectEvent: () => this.kill()}
        });
    }
})

sc.IceDiskEntity.inject({
    collideWith(entity, dir) {
        if(this.state === 2 && entity instanceof ig.ENTITY.EL_Prism) {
            entity.ballHit(this);
        } else this.parent(entity, dir);
    },
})