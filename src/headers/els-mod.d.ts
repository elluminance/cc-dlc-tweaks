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

        interface EL_ELEMENT_IF extends ig.ActionStepBase {
            branches: Record<string, ig.ActionStepBase>;
            init(this: this): void;
            getBranchNames(this: this): string[];
            getNext(this: this, entity: ig.ENTITY.Combatant): ig.ActionStepBase
        }
        
        interface EL_ELEMENT_IF_CONSTRUCTOR extends ImpactClass<EL_ELEMENT_IF> {}
        var EL_ELEMENT_IF: EL_ELEMENT_IF_CONSTRUCTOR;
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

    enum NPC_EVENT_TYPE {
        GEODE = "GEODE"
    }

    enum MENU_SUBMENU {
        GEODE_OPENING  = "GEODE_OPENING"
    }

    var MAP_INTERACT_ICONS: {[key: string]: sc.MapInteractIcon}

    interface GeodeRewardsGui extends ig.BoxGui {
        init(this: this): void
    }

    interface GeodeRewardsGuiConstructor extends ImpactClass<GeodeRewardsGui> {
        new (): sc.GeodeRewardsGui
    }

    var GeodeRewardsGui: GeodeRewardsGuiConstructor

    var BOOSTER_GEMS: sc.Inventory.ItemID[]

    interface GeodeOpeningGui extends sc.BaseMenu {
        ninepatch: ig.NinePatch

        init(this: this): void
    }

    interface GeodeOpeningGuiConstructor extends ImpactClass<GeodeOpeningGui> {}

    var GeodeOpeningGui: GeodeRewardsGuiConstructor
}