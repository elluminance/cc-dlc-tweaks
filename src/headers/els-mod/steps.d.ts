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

            var COPY_SPRITE_SPECIAL_COLOR_EL: COPY_SPRITE_SPECIAL_COLOR_EL_CONSTRUCTOR
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