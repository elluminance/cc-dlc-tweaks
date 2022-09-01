export {};

declare global {
    namespace ig {
        namespace EFFECT_ENTRY {
            namespace EffectSettings {
                interface COPY_SPRITE_SPECIAL_COLOR_EL extends COPY_SPRITE {
                    mode: string;
                }
            }

            interface COPY_SPRITE_SPECIAL_COLOR_EL extends ig.EFFECT_ENTRY.COPY_SPRITE {
                mode: string;
            }

            interface COPY_SPRITE_SPECIAL_COLOR_EL_CONSTRUCTOR extends ImpactClass<COPY_SPRITE_SPECIAL_COLOR_EL> {
                new (type: any, settings: ig.EFFECT_ENTRY.EffectSettings.COPY_SPRITE_SPECIAL_COLOR_EL): COPY_SPRITE_SPECIAL_COLOR_EL
            }

            var COPY_SPRITE_SPECIAL_COLOR_EL: COPY_SPRITE_SPECIAL_COLOR_EL_CONSTRUCTOR;


            namespace SET_MODE_AURA_HIDE {
                interface Settings {
                    setHide: boolean;
                }
            }
            interface SET_MODE_AURA_HIDE extends ig.EffectStepBase {
                setHide: boolean;
            }
            interface SET_MODE_AURA_HIDE_CONSTRUCTOR extends ImpactClass<SET_MODE_AURA_HIDE> {
                new (type: unknown, settings: SET_MODE_AURA_HIDE.Settings): SET_MODE_AURA_HIDE;
            }
            var SET_MODE_AURA_HIDE: SET_MODE_AURA_HIDE_CONSTRUCTOR;
        }

        namespace ACTION_STEP {
            namespace EL_SET_TARGET_POS {
                interface Settings {
                    newPos: Vec3
                    random: boolean
                    randRange: Vec2
                }
            }
            interface EL_SET_TARGET_POS extends ig.ActionStepBase {
                newPos: Vec3
                random: boolean
                randRange: Vec2

            }
            interface EL_SET_TARGET_POS_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET_POS> {
                new (settings: EL_SET_TARGET_POS.Settings): EL_SET_TARGET_POS
            }
            var EL_SET_TARGET_POS: EL_SET_TARGET_POS_CONSTRUCTOR;

            namespace EL_SET_PARTY_TEMP_TARGET_BY_INDEX {
                interface Settings {
                    value: number | ig.Vars.VarObject;
                }
            }
            interface EL_SET_PARTY_TEMP_TARGET_BY_INDEX extends ig.ActionStepBase {
                value: number | ig.Vars.VarObject;
                start(this: this, entity: ig.ENTITY.Combatant): void;
            }
            interface EL_SET_PARTY_TEMP_TARGET_BY_INDEX_CONSTRUCTOR extends ImpactClass<EL_SET_PARTY_TEMP_TARGET_BY_INDEX> {
                new (settings: EL_SET_PARTY_TEMP_TARGET_BY_INDEX.Settings): EL_SET_PARTY_TEMP_TARGET_BY_INDEX;
            }
            var EL_SET_PARTY_TEMP_TARGET_BY_INDEX: EL_SET_PARTY_TEMP_TARGET_BY_INDEX_CONSTRUCTOR


            namespace ADD_ARENA_SCORE {
                interface Settings {
                    scoreType: keyof sc.ARENA_SCORE_TYPES;
                }
            }
            interface ADD_ARENA_SCORE extends ig.ActionStepBase {
                scoreType: keyof sc.ARENA_SCORE_TYPES;
            }
            interface ADD_ARENA_SCORE_CONSTRUCTOR extends ImpactClass<ADD_ARENA_SCORE> {
                new (settings: ADD_ARENA_SCORE.Settings): ADD_ARENA_SCORE;
            }
            var ADD_ARENA_SCORE: ADD_ARENA_SCORE_CONSTRUCTOR;

            namespace SET_ENEMY_LEVEL {
                interface Settings {
                    level: number | ig.Vars.VarObject;
                }
            }
            interface SET_ENEMY_LEVEL extends ig.ActionStepBase {
                level: number | ig.Vars.VarObject;
            }
            interface SET_ENEMY_LEVEL_CONSTRUCTOR extends ImpactClass<SET_ENEMY_LEVEL> {
                new (settings: SET_ENEMY_LEVEL.Settings): SET_ENEMY_LEVEL;
            }
            var SET_ENEMY_LEVEL: SET_ENEMY_LEVEL_CONSTRUCTOR;

            //#region Vanilla Overrides
            namespace ADD_ACTION_BUFF {
                interface Settings {
                    customColor?: string;
                    timer?: number;
                }
            }

            interface ADD_ACTION_BUFF {
                customColor?: string;
                timer?: number;
            }
            //#endregion
        }

        namespace EVENT_STEP {
            interface OPEN_GEODE_MENU extends ig.EventStepBase {}
            interface OPEN_GEODE_MENU_CONSTRUCTOR extends ImpactClass<OPEN_GEODE_MENU> {
                new (): OPEN_GEODE_MENU
            }
            var OPEN_GEODE_MENU: OPEN_GEODE_MENU_CONSTRUCTOR;
        }
    }
}