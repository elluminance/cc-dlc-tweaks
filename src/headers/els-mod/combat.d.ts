export {};

declare global {
    namespace sc {
        namespace ENEMY_REACTION {
            interface EL_VIRUS_BUFF extends ENEMY_REACTION.COLLAB {}
            interface EL_VIRUS_BUFF_CONSTRUCTOR extends ImpactClass<EL_VIRUS_BUFF> {
                new (name: string, data: ENEMY_REACTION.COLLAB.Data): EL_VIRUS_BUFF;
            }
        }
        interface ENEMY_REACTION {
            EL_VIRUS_BUFF: ENEMY_REACTION.EL_VIRUS_BUFF_CONSTRUCTOR
        }
    }
}