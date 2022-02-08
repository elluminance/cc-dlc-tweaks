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

            interface GOTO_LABEL_WHILE {
                name: string;
                condition: string;
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

        interface GOTO_LABEL_WHILE extends ig.ActionStepBase {
            name: string;
            condition: ig.VarCondition;

            init(this: this, settings: ActionSettings.GOTO_LABEL_WHILE): void;
            getJumpLabelName(this: this): string | null;
        }
        interface GOTO_LABEL_WHILE_CONSTRUCTOR extends ImpactClass<GOTO_LABEL_WHILE> {}
        var GOTO_LABEL_WHILE: GOTO_LABEL_WHILE_CONSTRUCTOR
    }

    namespace EVENT_STEP {
        interface OPEN_GEODE_MENU extends ig.EventStepBase {
            init(this: this): void;
            start(this: this): void;
        }
        interface OPEN_GEODE_MENU_CONSTRUCTOR extends ImpactClass<OPEN_GEODE_MENU> {}
        var OPEN_GEODE_MENU: OPEN_GEODE_MENU_CONSTRUCTOR;
    }

    namespace Vars {
        namespace KnownVars {
            interface plot {
                completedPostGame?: boolean
            }
        }
        interface KnownVarStrings {
            "dlctweaks.crystals": number;
        }
    }
    
}

declare namespace sc {
    namespace Modifiers {
        interface KnownModifers {
            RISKTAKER: true;
            LIFESTEAL: true;
            EL_GEODE_FINDER: true;
        }
    }

    interface PlayerModel {
        getCrystalCoins(): number;
        addCrystalCoins(amount: number): void;
        setCrystalCoins(amount: number): void;
    }
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

    interface ShopConfirmEntry {
        gemGfx: ig.Image;
    }

    enum NPC_EVENT_TYPE {
        GEODE = "GEODE"
    }

    enum MENU_SUBMENU {
        GEODE_OPENING  = "GEODE_OPENING"
    }

    var MAP_INTERACT_ICONS: Record<string, sc.MapInteractIcon>;

    interface ShopCartEntry {
        gemGfx: ig.Image;
    }

    namespace ShopModel {
        interface ShopItem {
            maxOwn?: number;
        }
    }

    namespace ShopItemButton {
        interface Data extends sc.ListBoxButton.Data {
            maxOwn: number;
        }
    }

    interface ShopItemButton {
        data: sc.ShopItemButton.Data;
        maxOwn: number;
    }

    //#region Geode
    interface GeodeRewardsGui extends Omit<sc.ModalButtonInteract, "init"> {
        sounds: Record<string, ig.Sound>;
        ninepatch: ig.NinePatch;
        list: sc.ScrollPane;
        listContent: ig.GuiElementBase;
        listItems: GeodeOpeningGui.ItemAmounts;
        crystals: number;
        timer: number;
        done: boolean;
        currentIndex: number;
        listEntries: [string, GeodeOpeningGui.ItemAmount][]
        listitemYOffset: number;

        init(this: this, items: sc.GeodeOpeningGui.ItemAmounts, crystals: number): void;
        onDialogCallback(this: this): void;
        createList(this: this): void;
        setListItems(this: this, items: sc.GeodeOpeningGui.ItemAmounts, crystals: number): void;
    }

    interface GeodeRewardsGuiConstructor extends ImpactClass<GeodeRewardsGui> {
        new (): sc.GeodeRewardsGui;
        new (items: sc.GeodeOpeningGui.ItemAmounts, crystals: number): sc.GeodeRewardsGui
    }
    var GeodeRewardsGui: GeodeRewardsGuiConstructor

    interface GeodeRewardEntry extends ig.GuiElementBase {
        gfx: ig.Image;
        item: sc.TextGui;
        amount: sc.NumberGui;
        isGems: boolean;
        transitions: Record<string, ig.GuiHook.Transition>;
        init(this: this, itemName: string, amount: number, isGems: boolean): void;
        updateDrawables(this: this, b: ig.GuiRenderer): void;
    }
    interface GeodeRewardEntryConstructor extends ImpactClass<GeodeRewardEntry> {
        new (itemName: string, amount: number, isGems?: boolean): sc.GeodeRewardEntry;
    }
    var GeodeRewardEntry: GeodeRewardEntryConstructor

    var BOOSTER_GEMS: sc.Inventory.ItemID[]

    namespace GeodeOpeningGui {
        interface ItemAmount {
            amount: number;
            isRare?: boolean;
        }
        type ItemAmounts = Record<sc.Inventory.ItemID, ItemAmount>
    }

    interface GeodeOpeningGui extends sc.BaseMenu {
        ninepatch: ig.NinePatch;
        textGui: sc.TextGui;
        geodeText: sc.TextGui;
        geodeAmount: sc.NumberGui;
        costText: sc.TextGui;
        costNumber: sc.NumberGui;
        buttonInteract: ig.ButtonInteractEntry;
        content: ig.GuiElementBase;
        buttongroup: sc.ButtonGroup;
        buttons: {
            increment: sc.ButtonGui;
            decrement: sc.ButtonGui;
            bigIncrement: sc.ButtonGui;
            bigDecrement: sc.ButtonGui;
        }
        rewardGui: sc.GeodeRewardsGui;
        openGeodesButton: sc.ButtonGui;
        msgBox: sc.CenterBoxGui;
        count: number;
        pricePerGeode: number;
        rareRewards: sc.Inventory.ItemID[];
        rareItemChance: number;

        init(this: this): void;
        onButtonCallback(this: this, button: sc.ButtonGui): void;
        incrementValue(this: this, number: number): void;
        openGeodes(this: this): void;
        getMaxGeodes(this: this): number;
        _updateCounters(this: this): void;
        onBackButtonPress(this: this): void;
    }

    interface GeodeOpeningGuiConstructor extends ImpactClass<GeodeOpeningGui> {}

    var GeodeOpeningGui: GeodeOpeningGuiConstructor;
    //#endregion Geode
}