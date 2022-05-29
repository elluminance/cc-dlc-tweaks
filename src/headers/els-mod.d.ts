export {}

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
            namespace ActionSettings {
                interface EL_SET_TARGET_POS {
                    newPos: Vec3
                    random: boolean
                    randRange: Vec2
                }
            }
            

            interface EL_SET_TARGET_POS extends ig.ActionStepBase {
                newPos: Vec3
                random: boolean
                randRange: Vec2

                init (this: this, settings: ActionSettings.EL_SET_TARGET_POS): void
            }
            interface EL_SET_TARGET_POS_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET_POS> {
            }

            var EL_SET_TARGET_POS: EL_SET_TARGET_POS_CONSTRUCTOR;

            
        }

        namespace EVENT_STEP {
            interface OPEN_GEODE_MENU extends ig.EventStepBase {}
            interface OPEN_GEODE_MENU_CONSTRUCTOR extends ImpactClass<OPEN_GEODE_MENU> {
                new (): OPEN_GEODE_MENU
            }
            var OPEN_GEODE_MENU: OPEN_GEODE_MENU_CONSTRUCTOR;
        }

        interface KnownVars {
            "dlctweaks.crystals": number;
        }

        namespace Database {
            interface Data {
                "el-geodeRewards": ELGeodeReward[];
            }
            
            interface ELGeodeReward {
                items: sc.ItemID[];
                weight: number;
                order: number;
            }
        }

        namespace ENTITY {
            interface Combatant {
                ignoreOverheal?: boolean;
            }
        }
    }

    namespace sc {
        interface MODIFIERS {
            EL_RISKTAKER: sc.Modifier;
            EL_LIFESTEAL: sc.Modifier;
            EL_GEODE_FINDER: sc.Modifier;
            EL_COND_GUARD_ALL: sc.Modifier;
            EL_TRANCE: sc.Modifier;
            EL_OVERHEAL: sc.Modifier;
            EL_TRICKSTER: sc.Modifier;

            EL_NEUTRAL_BOOST: sc.Modifier;
            EL_HEAT_BOOST: sc.Modifier;
            EL_COLD_BOOST: sc.Modifier;
            EL_SHOCK_BOOST: sc.Modifier;
            EL_WAVE_BOOST: sc.Modifier;
        }

        interface PlayerModel {
            getCrystalCoins(): number;
            addCrystalCoins(amount: number): void;
            subCrystalCoins(amount: number): void;
            setCrystalCoins(amount: number): void;
        }
        let EL_TRICKSTER_STAT_CHANGES: string[];
        interface CombatParams {
            el_lifestealTimer: number;
            el_lifestealHealed: number;
            el_tricksterTimer: number;
            el_tricksterBuff?: sc.DynamicBuff;

            increaseHpOverheal(this: this, amount: number, maxOverheal: number): void;
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

        interface ARENA_BONUS_OBJECTIVE {
            INTERROGATION_HITS: sc.Arena.ArenaBonusObjective;
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
            GEODE_OPENING = "GEODE_OPENING"
        }

        var MAP_INTERACT_ICONS: Record<string, sc.MapInteractIcon>;

        interface ShopCartEntry {
            gemGfx: ig.Image;
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

            onDialogCallback(this: this): void;
            createList(this: this): void;
            setListItems(this: this, items: sc.GeodeOpeningGui.ItemAmounts, crystals: number): void;
        }

        interface GeodeRewardsGuiConstructor extends ImpactClass<GeodeRewardsGui> {
            new (items?: sc.GeodeOpeningGui.ItemAmounts, crystals?: number): sc.GeodeRewardsGui
        }
        var GeodeRewardsGui: GeodeRewardsGuiConstructor

        interface GeodeRewardEntry extends ig.GuiElementBase {
            gfx: ig.Image;
            item: sc.TextGui;
            amount: sc.NumberGui;
            isGems: boolean;
            transitions: Record<string, ig.GuiHook.Transition>;
            updateDrawables(this: this, b: ig.GuiRenderer): void;
        }
        interface GeodeRewardEntryConstructor extends ImpactClass<GeodeRewardEntry> {
            new(itemName: string, amount: number, isGems?: boolean): sc.GeodeRewardEntry;
        }
        var GeodeRewardEntry: GeodeRewardEntryConstructor

        var BOOSTER_GEMS: sc.ItemID[]

        namespace GeodeOpeningGui {
            interface ItemAmount {
                amount: number;
                isRare?: boolean;
                orderMult?: number;
            }
            type ItemAmounts = Record<sc.ItemID, ItemAmount>

            interface RewardEntry {
                items: sc.ItemID[];
                summedWeight: number;
                isRare?: boolean;
                order: number;
            }
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
            rewardTable: GeodeOpeningGui.RewardEntry[];
            totalWeight: number;

            onButtonCallback(this: this, button: sc.ButtonGui): void;
            incrementValue(this: this, number: number): void;
            openGeodes(this: this): void;
            getMaxGeodes(this: this): number;
            _updateCounters(this: this): void;
            onBackButtonPress(this: this): void;
            generateRewardTable(this: this): void;
        }

        interface GeodeOpeningGuiConstructor extends ImpactClass<GeodeOpeningGui> {
            new (): GeodeOpeningGui
        }

        var GeodeOpeningGui: GeodeOpeningGuiConstructor;
        //#endregion Geode


        interface StatChangeSettings {
            overheal?: number;
            absoluteHeal?: boolean;
        }

        namespace HealInfo {
            interface Settings {
                overheal?: number;
            }
        }
        
        interface HealInfo {
            overheal?: number;
        }

        interface DynamicBuff extends sc.StatChange {
            active: boolean;
            name: string;
            time: number;
            timer: number;
            changeStat(statChanges: string[], resetTimer?: number | boolean): void;
        }
        interface DynamicBuffConstructor extends ImpactClass<DynamicBuff> {
            new (statChanges: string[], name: string,  time?: number, customTimerColor?: string): sc.DynamicBuff;
        }
        let DynamicBuff: DynamicBuffConstructor;

        interface StatChange {
            buffHudEntry?: sc.BuffHudEntry;
            customTimerColor?: string;
        }
        interface BuffHudEntry {
            textGui: sc.TextGui;
            setIcon(this: this, iconString: string): void;
        }

        enum COMBAT_PARAM_MSG {
            BUFF_CHANGED,
        }
    }
}