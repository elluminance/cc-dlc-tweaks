export {};

declare global {
    namespace ig.EVENT_STEP {
        namespace EL_ENABLE_STAT_OVERRIDE {
            interface Settings {
                state: boolean;
            }
            interface Constructor extends ImpactClass<EL_ENABLE_STAT_OVERRIDE> {
                new (settings: Settings): EL_ENABLE_STAT_OVERRIDE;
            }
        }
        interface EL_ENABLE_STAT_OVERRIDE extends ig.EventStepBase {
            state: boolean;
        }
        let EL_ENABLE_STAT_OVERRIDE: EL_ENABLE_STAT_OVERRIDE.Constructor;

        namespace START_EL_GAUNTLET {
            interface Constructor extends ImpactClass<START_EL_GAUNTLET> {}
        }
        interface START_EL_GAUNTLET extends ig.EventStepBase {}
        let START_EL_GAUNTLET: START_EL_GAUNTLET.Constructor;
    }

    namespace el {
        namespace GauntletStepBase {
            interface Constructor extends ImpactClass<GauntletStepBase> {
                new (): GauntletStepBase;
            }

            interface Settings {
                type: string;
            }
        }
        //behaves like action/event steps, but simplified
        interface GauntletStepBase extends ig.Class {
            advanceRoundNumber: boolean;
            next?: GauntletStep;

            //called when round is started
            start(this: this): void;
            //called every update loop to see if round is finished.
            //returns true if ready to advance to next round.
            canAdvanceRound(this: this): boolean;
        }
        let GauntletStepBase: GauntletStepBase.Constructor;
        type GauntletStep = GauntletStepBase;
    }

    namespace el.GAUNTLET_STEP {
        namespace SIMPLE_ENEMY_ROUND {
            interface Constructor extends ImpactClass<SIMPLE_ENEMY_ROUND>{
                new (settings: Settings): SIMPLE_ENEMY_ROUND;
            }

            interface Settings extends GauntletStepBase.Settings {
                enemies: GauntletController.EnemyEntry[];
                level: number;
            }
        }
        interface SIMPLE_ENEMY_ROUND extends el.GauntletStepBase {
            enemies: GauntletController.EnemyEntry[];
            level: number;
            toKill: number;
            //numKilled: number;
        }
        let SIMPLE_ENEMY_ROUND: SIMPLE_ENEMY_ROUND.Constructor;
    }

}