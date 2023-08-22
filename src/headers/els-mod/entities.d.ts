export {};

declare global {
    namespace ig.ENTITY {
        interface Combatant {
            hideModeAura?: boolean;
        }

        interface Ball extends ig.ENTITY.EL_Prism.Splittable<Ball> {}

        interface WallBlocker {
            el_glowTimer: number;
        }
    }
    namespace sc {
        enum WALL_COLL_TYPES {
            BALL_DESTROYER
        }

        namespace CombatProxyEntity {
            namespace Settings {
                interface Data {
                    animSheet?: string;
                    walkAnims?: ig.ActorEntity.WalkAnims;
                }
            }
        }
        interface CompressedBaseEntity extends ig.ENTITY.EL_Prism.Splittable<CompressedBaseEntity> {}
        interface IceDiskEntity extends ig.ENTITY.EL_Prism.Splittable<IceDiskEntity> {}
    }
}