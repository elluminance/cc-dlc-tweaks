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
        //#region SIMPLE_ENEMY_ROUND
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
        //#endregion

        //#region CHANGE_VARS
        namespace CHANGE_VARS {
            interface Constructor extends ImpactClass<CHANGE_VARS>{
                new (settings: Settings): CHANGE_VARS;
            }

            type VarVal = ig.VarValue | ig.Event.VarExpression<ig.VarValue>
            interface Settings extends GauntletStepBase.Settings {
                vars: Record<string, VarVal>;
            }
        }
        interface CHANGE_VARS extends el.GauntletStepBase {
            vars: Record<string, CHANGE_VARS.VarVal>;
        }
        let CHANGE_VARS: CHANGE_VARS.Constructor;
        //#endregion

        //#region DEBUG_LOG
        namespace DEBUG_LOG {
            interface Constructor extends ImpactClass<DEBUG_LOG>{
                new (settings: Settings): DEBUG_LOG;
            }

            interface Settings extends GauntletStepBase.Settings {
                msg: string;
            }
        }
        interface DEBUG_LOG extends el.GauntletStepBase {
            msg: string
        }
        let DEBUG_LOG: DEBUG_LOG.Constructor;
        //#endregion
        
        //#region DO_EVENT
        namespace DO_EVENT {
            interface Constructor extends ImpactClass<DO_EVENT>{
                new (settings: Settings): DO_EVENT;
            }

            interface Settings extends GauntletStepBase.Settings {
                event: unknown[];
                isBlocking: boolean;
            }
        }
        interface DO_EVENT extends el.GauntletStepBase {
            event: ig.Event;
            isBlocking: boolean;
            inEvent: boolean;
        }
        let DO_EVENT: DO_EVENT.Constructor;
        //#endregion
    }
}