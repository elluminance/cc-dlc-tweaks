export {};

declare global {
    namespace ig {
        namespace ENTITY {
            interface Combatant {
                hideModeAura?: boolean;
            }

            namespace Ball {
                interface PrismData {
                    timer: number;
                    rootBall: ig.ENTITY.Ball | null;
                    children: ig.ENTITY.Ball[];
                }
            }
            interface Ball {
                el_prism: Ball.PrismData;
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