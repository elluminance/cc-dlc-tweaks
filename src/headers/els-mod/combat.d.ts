export {};

declare global {
    namespace sc {
        namespace ENEMY_REACTION {
            interface EL_VIRUS_BUFF extends ENEMY_REACTION.COLLAB {}
            interface EL_VIRUS_BUFF_CONSTRUCTOR extends ImpactClass<EL_VIRUS_BUFF> {
                new (name: string, data: ENEMY_REACTION.COLLAB.Data): EL_VIRUS_BUFF;
            }
            let EL_VIRUS_BUFF: ENEMY_REACTION.EL_VIRUS_BUFF_CONSTRUCTOR
        }
        namespace COMBAT_CONDITION {
            namespace TARGET_HAS_BUFF {
                interface Settings {
                    buffName: string;
                    max: number;
                    min: number;
                }
            }
            interface TARGET_HAS_BUFF extends ig.Class, CombatCondition {
                buffName: string;
                max: number;
                min: number;
            }
            interface TARGET_HAS_BUFF_CONSTRUCTOR extends ImpactClass<TARGET_HAS_BUFF> {
                new (settings: TARGET_HAS_BUFF.Settings): TARGET_HAS_BUFF;
            }
        }
        interface COMBAT_CONDITION {
            TARGET_HAS_BUFF: COMBAT_CONDITION.TARGET_HAS_BUFF_CONSTRUCTOR;
        }
    }
}