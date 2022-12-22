export {};

declare global {
    namespace ig {
        namespace ENTITY {
            interface Combatant {
                hideModeAura?: boolean;
            }
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
            interface Settings {
            }
        }
    }
}