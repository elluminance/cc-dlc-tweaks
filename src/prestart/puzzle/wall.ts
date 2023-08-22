Object.assign(el.Constants, {
    BallDestroyerWallTopDefault: "#ff9f9f",
    BallDestroyerWallFrontDefault: "#ff1717"
})

const GLOW_TIME = 0.2
ig.ENTITY.WallBlocker.inject({
    el_glowTimer: 0,

    init(x, y, z, settings) {
        this.parent(x,y,z,settings);

        if(settings.collType === "BALL_DESTROYER") {
            let colors = ig.mapStyle.get("walls").colors;
            this.colorGfx = new ig.DoubleColor(
                new ig.TransitionColor(colors.ballDestroyTop || el.Constants.BallDestroyerWallTopDefault, "white"),
                new ig.TransitionColor(colors.ballDestroyFront || el.Constants.BallDestroyerWallFrontDefault, "white")
            )
            this.ballDestroyer = true;
            this.coll.type = ig.COLLTYPE.FENCE;
        }
    },
    update() {
        this.parent();
        if(this.el_glowTimer > 0) this.el_glowTimer -= ig.system.tick;
    },

    updateSprites() {
        this.parent();

        if(this.el_glowTimer > 0 && this.coll.size.z > 0) {
            let sprite = this.sprites[0];
            let val = KEY_SPLINES.EASE_IN.get((this.el_glowTimer / GLOW_TIME).limit(0,1));

            this.colorGfx.color1.setColorBWeight(val);
            this.colorGfx.color2.setColorBWeight(val);
            sprite.setImageSrc(this.colorGfx);
        }
    },

    ballHit(entity) {
        let ball = entity as ig.ENTITY.Ball;
        if(this.ballDestroyer && ball.isBall) {
            sc.combat.showHitEffect(this, ball.getHitCenter(this), sc.ATTACK_TYPE.NONE, ball.getElement(), false, false, false);
            this.el_glowTimer = GLOW_TIME;
            return true;
        }
        return false;
    }
})
