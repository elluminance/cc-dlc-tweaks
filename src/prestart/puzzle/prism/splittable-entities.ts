import { Vec3ToTuple } from "../../../helper-funcs.js";


function applyPrismData<T>(
    baseClass: T,
) {
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

ig.ENTITY.Ball.inject({
    getPrismGlowColor() {
        return ElementToColor(this.getElement());
    },
    prismSpawnFunc(prism, pos, vel) {
        let combatantRoot = this.getCombatantRoot() as sc.PlayerBaseEntity;
        return sc.PlayerConfig.getElementBall(
            combatantRoot,
            this.getElement(),
            this.attackInfo.hasHint("CHARGED")
        ).spawn(pos.x, pos.y, pos.z, combatantRoot, vel) as ig.ENTITY.Ball;
    },
    onPrismSpawn(prism, root) {
        this.attackInfo = ig.copy(root.attackInfo);
        this.attackInfo.damageFactor *= 0.75;
        this.attackInfo.spFactor *= 0.5;
        this.attackInfo.statusInflict *= 0.75;

        this.timer = root.timer;
        this.remainingHits = root.remainingHits;
    },
})

sc.CompressedBaseEntity.inject({
    getPrismGlowColor() {
        return ElementToColor(this.getElement());
    },
    onPrismSpawn(prism, root) {
        this.speedFactor = root.speedFactor;
        this.fastMode = root.fastMode;
        this.globalCount = root.globalCount + 0.5;
        this.killTimer = root.killTimer;
        this.combatant = root.combatant;
        this.attackInfo = root.attackInfo;

        root.globalCount++;
    },
    postPrismSplit(prism) {
        for(let entity of ig.game.getEntitiesByType(sc.CompressedBaseEntity)) {
            entity.globalCount += 1;
        }

        this.kill();
    },
})

sc.IceDiskEntity.inject({
    onPrismSpawn(prism, root) {
        this.slide(this.coll.vel, root.combatant);
        this.timer = root.timer;
        this.panel = root.panel;
    },
    postPrismSplit(prism) {
        this.kill();
    },

    getPrismGlowColor() {
        return "#a4ebff";
    },

    collideWith(entity, dir) {
        if(this.state === 2 && entity instanceof ig.ENTITY.EL_Prism) {
            //@ts-expect-error
            entity.ballHit(this);
        } else this.parent(entity, dir);
    },
})