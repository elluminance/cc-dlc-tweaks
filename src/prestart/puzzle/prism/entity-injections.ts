ig.ENTITY.WavePushPullBlock.inject({
    ballAttached: null,
    lastTeleportPos: null,

    init(...args) {
        this.parent(...args);
        this.lastTeleportPos = Vec3.create();
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
            let entity = ig.game.spawnEntity(el.WavePushPullBlockPrismCopy, this.lastTeleportPos.x, this.lastTeleportPos.y, this.lastTeleportPos.z);
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