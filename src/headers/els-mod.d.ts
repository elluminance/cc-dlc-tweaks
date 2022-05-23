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

                interface SET_ATTRIB_CURRENT_POS {
                    attrib: string;
                }
            }
            interface EL_SET_TARGET extends ig.ActionStepBase {
                name: string;
                start(this: this, target: ig.ENTITY.Combatant): void
            }
            interface EL_SET_TARGET_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET> {
                new (settings: ActionSettings.EL_SET_TARGET): EL_SET_TARGET
            }
            var EL_SET_TARGET: EL_SET_TARGET_CONSTRUCTOR;

            interface EL_SET_TARGET_POS extends ig.ActionStepBase {
                newPos: Vec3
                random: boolean
                randRange: Vec2

                init (this: this, settings: ActionSettings.EL_SET_TARGET_POS): void
            }
            interface EL_SET_TARGET_POS_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET_POS> {
            }

            var EL_SET_TARGET_POS: EL_SET_TARGET_POS_CONSTRUCTOR;

            interface EL_ELEMENT_IF extends ig.ActionStepBase {
                branches: Record<string, ig.ActionStepBase>;
                getBranchNames(this: this): string[];
                getNext(this: this, entity: ig.ENTITY.Combatant): ig.ActionStepBase
            }

            interface EL_ELEMENT_IF_CONSTRUCTOR extends ImpactClass<EL_ELEMENT_IF> {
                new (): EL_ELEMENT_IF;
            }
            var EL_ELEMENT_IF: EL_ELEMENT_IF_CONSTRUCTOR;

            interface GOTO_LABEL_WHILE extends ig.ActionStepBase {
                name: string;
                condition: ig.VarCondition;

                getJumpLabelName(this: this): string | null;
            }
            interface GOTO_LABEL_WHILE_CONSTRUCTOR extends ImpactClass<GOTO_LABEL_WHILE> {
                new (settings: ActionSettings.GOTO_LABEL_WHILE): GOTO_LABEL_WHILE;
            }
            var GOTO_LABEL_WHILE: GOTO_LABEL_WHILE_CONSTRUCTOR

            interface SET_ATTRIB_CURRENT_POS extends ig.ActionStepBase {
                attrib: string;
                init(this: this, settings: ActionSettings.SET_ATTRIB_CURRENT_POS): void;
            }
            interface SET_ATTRIB_CURRENT_POS_CONSTRUCTOR extends ImpactClass<SET_ATTRIB_CURRENT_POS> { }
            var SET_ATTRIB_CURRENT_POS: SET_ATTRIB_CURRENT_POS_CONSTRUCTOR

            namespace SET_CLOSE_TEMP_TARGET {
                interface Settings {
                    customSearchType?: SearchType
                }
            }
        }

        namespace EVENT_STEP {
            interface OPEN_GEODE_MENU extends ig.EventStepBase {}
            interface OPEN_GEODE_MENU_CONSTRUCTOR extends ImpactClass<OPEN_GEODE_MENU> {
                new (): OPEN_GEODE_MENU
            }
            var OPEN_GEODE_MENU: OPEN_GEODE_MENU_CONSTRUCTOR;

            namespace OPEN_EL_COLOR_PICKER {
                interface Settings {
                    varPath: string;
                    title: ig.LangLabel.Data;
                }

                interface Data {
                    done: boolean
                }
            }
            interface OPEN_EL_COLOR_PICKER extends ig.EventStepBase {
                varPath: string;
                title: ig.LangLabel.Data;

                start(this: this, data: OPEN_EL_COLOR_PICKER.Data): void;
                run(this: this, data: OPEN_EL_COLOR_PICKER.Data): boolean;
            }
            interface OPEN_EL_COLOR_PICKER_CONSTRUCTOR extends ImpactClass<OPEN_EL_COLOR_PICKER> {
                new (settings: OPEN_EL_COLOR_PICKER.Settings): OPEN_EL_COLOR_PICKER;
            }
            let OPEN_EL_COLOR_PICKER: OPEN_EL_COLOR_PICKER_CONSTRUCTOR;
        }

        interface KnownVars {
            "dlctweaks.crystals": number;
        }

        namespace Database {
            interface Data {
                "el-geodeRewards": ELGeodeReward[];
            }
            
            interface ShopItem {
                maxOwn?: number;
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

        namespace EL_ModalColorPicker {
            interface Color {
                red: number;
                green: number;
                blue: number;
            }

            interface Slider extends ig.GuiElementBase {
                nameText: sc.TextGui;
                slider: sc.OptionFocusSlider;
                value: number;
                callback: () => void;

                setValue(value: number): void;
            }

            interface SliderConstructor extends ImpactClass<Slider> {
                new (colorName: string, initialValue: number): Slider;
            }

            interface ColorSquare extends ig.GuiElementBase {
                color: string;
                setColor(this: this, color: sc.EL_ModalColorPicker.Color): void;
            }

            interface ColorSquareConstructor extends ImpactClass<ColorSquare> {
                new (w: number, h: number, color: EL_ModalColorPicker.Color): ColorSquare
            }
        }

        interface EL_ModalColorPicker extends sc.ModalButtonInteract {
            colors: EL_ModalColorPicker.Color
            varPath: string;
            sliderRed: sc.EL_ModalColorPicker.Slider;
            sliderGreen: sc.EL_ModalColorPicker.Slider;
            sliderBlue: sc.EL_ModalColorPicker.Slider;
            colorSquare: sc.EL_ModalColorPicker.ColorSquare;

            onChange(this: this): void;
        }
        interface EL_ModalColorPickerConstructor extends ImpactClass<EL_ModalColorPicker> {
            new (varPath: string, label?: ig.LangLabel.Data, callback?: () => void): EL_ModalColorPicker;

            Slider: EL_ModalColorPicker.SliderConstructor;
            ColorSquare: EL_ModalColorPicker.ColorSquareConstructor;
        }
        let EL_ModalColorPicker: EL_ModalColorPickerConstructor;

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