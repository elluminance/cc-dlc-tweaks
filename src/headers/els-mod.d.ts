declare namespace ig {
    namespace ACTION_STEP {
        namespace ActionSettings {
            interface EL_SET_TARGET {
                name: string
            }

            interface EL_SET_TARGET_POS {
                newPos: Vec3
                random: boolean
                randRange: Vec2
            }
        }
        interface EL_SET_TARGET extends ig.ActionStepBase {
            name: string;
            init(this: this, settings: ActionSettings.EL_SET_TARGET): void
            start(this: this, target: ig.ENTITY.Combatant): void
        }
        interface EL_SET_TARGET_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET> {
        }
        var EL_SET_TARGET: EL_SET_TARGET_CONSTRUCTOR;

        interface EL_SET_TARGET_POS extends ig.ActionStepBase {
            newPos: Vec3
            random: boolean
            randRange: Vec2

            init(this: this, settings: ActionSettings.EL_SET_TARGET_POS): void
        }
        interface EL_SET_TARGET_POS_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET_POS> { }

        var EL_SET_TARGET_POS: EL_SET_TARGET_POS_CONSTRUCTOR;
    }

    namespace EVENT_STEP {
        namespace EventSettings {
            interface OPEN_GEODES {
                count?: number | "all"
            }
        }

        interface OPEN_GEODES extends ig.EventStepBase {
            count: number | "all"
            init(this: this, settings: EventSettings.OPEN_GEODES): void
            start(this: this): void
        }

        interface OPEN_GEODES_CONSTRUCTOR extends ImpactClass<OPEN_GEODES> {
            new (settings: EventSettings.OPEN_GEODES): OPEN_GEODES
        }

        var OPEN_GEODES: OPEN_GEODES_CONSTRUCTOR
    }

    namespace Vars.KnownVars {
        interface plot {
            completedPostGame?: boolean
        }
    }
}

declare namespace sc {
    interface CombatParams {
        el_lifestealTimer: number
        el_lifestealHealed: number
    }

    interface EnemyBooster {
        ascendedBooster: {
            active: boolean,
            skipCheck: boolean,
            forceCheck: boolean,
            calcLevel(enemyType: sc.EnemyType): number,
        }
    }

    interface SaveSlotChapter {
        postgameStarGfx: ig.Image
        postgameStar: ig.ImageGui

        showPostgameStar(this: this, dlcBeaten: boolean | undefined, gameBeaten: boolean | undefined): void
    }

    interface MenuModel {
        shopGemCoinMode: boolean
    }

    enum MENU_SHOP_TYPES {
        CRYSTAL = "CRYSTALS"
    }
}