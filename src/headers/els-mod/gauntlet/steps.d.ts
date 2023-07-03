export {};

declare global {
    namespace ig.EVENT_STEP {
        namespace START_EL_GAUNTLET {
            interface Constructor extends ImpactClass<START_EL_GAUNTLET> {}
        }
        interface START_EL_GAUNTLET extends ig.EventStepBase {}
        let START_EL_GAUNTLET: START_EL_GAUNTLET.Constructor;

        namespace SHOW_GAUNTLET_LEVEL_UP {
            interface Constructor extends ImpactClass<SHOW_GAUNTLET_LEVEL_UP> {
                new (): SHOW_GAUNTLET_LEVEL_UP;
            }
            interface Settings extends ig.EventStepBase.Settings {}
        }
        interface SHOW_GAUNTLET_LEVEL_UP extends ig.EventStepBase {
            levelGui: el.GauntletLevelUpGui;
        }
        let SHOW_GAUNTLET_LEVEL_UP: SHOW_GAUNTLET_LEVEL_UP.Constructor;
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
            isProperRound: boolean;
            next?: GauntletStep;
            cup: el.GauntletCup

            //called when round is started
            start(this: this, runtime: el.GauntletController.Runtime): void;
            //called every update loop to see if round is finished.
            //returns true if ready to advance to next round.
            canAdvanceRound(this: this): boolean;

            nextStep(this: this): [el.GauntletStep | undefined, el.GauntletStep | undefined];
            getBranch?(this: this): el.GauntletStep | undefined;
        }
        let GauntletStepBase: GauntletStepBase.Constructor;
        type GauntletStep = GauntletStepBase;

        namespace GauntletFunction {
            interface Constructor extends ImpactClass<GauntletFunction> {
                new (steps: GauntletStep[]): GauntletFunction
            }
        }
        interface GauntletFunction extends ig.Class {
            steps: GauntletStep[];
        }
        let GauntletFunction: GauntletFunction.Constructor;
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
                event: ig.EventStepBase.Settings[];
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

        //#region SPAWN_ENTITIES
        namespace SPAWN_ENTITIES {
            interface Constructor extends ImpactClass<SPAWN_ENTITIES>{
                new (settings: Settings): SPAWN_ENTITIES;
            }

            interface EntityEntry {
                type: string,
                settings: ig.Entity.Settings;
                offPos: Vec3;
                marker?: string;
            }

            interface Settings extends GauntletStepBase.Settings {
                entities: EntityEntry[];
            }
        }
        interface SPAWN_ENTITIES extends el.GauntletStepBase {
            entities: SPAWN_ENTITIES.EntityEntry[];
        }
        let SPAWN_ENTITIES: SPAWN_ENTITIES.Constructor;
        //#endregion

        //#region KILL_ENTITIES
        namespace KILL_ENTITIES {
            interface Constructor extends ImpactClass<KILL_ENTITIES>{
                new (settings: Settings): KILL_ENTITIES;
            }

            interface EntityEntryData {
                name: string;
                killEffect?: ig.EffectHandle.Settings
            }

            interface EntityEntry {
                name: string;
                killEffect: Optional<ig.EffectHandle>;
            }

            interface Settings extends GauntletStepBase.Settings {
                entities: (EntityEntryData | string)[];
            }
        }
        interface KILL_ENTITIES extends el.GauntletStepBase {
            entities: KILL_ENTITIES.EntityEntry[];
        }
        let KILL_ENTITIES: KILL_ENTITIES.Constructor;
        //#endregion
    
        //#region CALL_FUNCTION
        namespace CALL_FUNCTION {
            interface Constructor extends ImpactClass<CALL_FUNCTION>{
                new (settings: Settings): CALL_FUNCTION;
            }

            interface Settings extends GauntletStepBase.Settings {
                name: string;
            }
        }
        interface CALL_FUNCTION extends el.GauntletStepBase {
            name: string
        }
        let CALL_FUNCTION: CALL_FUNCTION.Constructor;
        //#endregion
    }
}