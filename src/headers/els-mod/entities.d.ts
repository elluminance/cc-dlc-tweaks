export {};

declare global {
    namespace ig {
        namespace ENTITY {
            interface Combatant {
                hideModeAura?: boolean;
            }

            interface Ball extends ig.ENTITY.EL_Prism.Splittable<Ball> {}
        }
    }
    namespace sc {
        namespace CombatProxyEntity {
            namespace Settings {
                interface Data {
                    animSheet?: string;
                    walkAnims?: ig.ActorEntity.WalkAnims;
                }
            }
        }
        interface CompressedBaseEntity extends ig.ENTITY.EL_Prism.Splittable<CompressedBaseEntity> {}
    }
}