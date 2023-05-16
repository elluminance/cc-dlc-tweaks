export {};

declare global {
    namespace ig {
        namespace Database {
            interface Data {
                "el-gems": EL_Gems;
            }

            namespace EL_Gems {
                interface Tier {
                    level: number;
                    cost: number;
                    value: number;
                }
                interface GemEntry {
                    stat: string;
                    gemColor: keyof typeof el.GEM_COLORS;
                    order?: number;
                    numberStyle?: el.GemDatabase.GemNumberStyle;
                    langLabel?: ig.LangLabel.Data;
                    statLangLabel?: ig.LangLabel.Data;
                    shortDesc?: ig.LangLabel.Data;
                    tiers: Tier[];
                }
            }
            interface EL_Gems {
                gemTypes: Record<string, EL_Gems.GemEntry>;
            }
        }
    }
    namespace sc {
        interface EquipBodyPartContainer {
            gemButton: sc.ButtonGui;
        }

        enum MENU_SUBMENU {
            EL_GEM_EQUIP = "EL_GEM_EQUIP"
        }
        enum MENU_EVENT { 
            EL_GEM_SELECTED,
            EL_GEM_HOVERED,
            EL_GEM_HIDE_SELECTOR,
        }
        interface CombatParams {
            elGemBonuses?: el.GemDatabase.ParamBonuses;
        }
    }

    namespace el {
        enum GEM_COLORS {
            DEFAULT = 0,
            RUBY = 1,
            GARNET = 2,
            DIAMOND = 3,
            MOONSTONE = 4,
            CITRINE = 5,
            TOPAZ = 6,
            AMETHYST = 7,
            EMERALD = 8,
            LAPIS_LAZULI = 9,
            AQUAMARINE = 10,
            ONYX = 11,
            BLOODSTONE = 12,
        }

        enum GEM_SORT_TYPE {
            ORDER,
            LEVEL,
            NAME,
            COST,
        }

        interface GemHelper {
            gemColorToIcon: Record<el.GEM_COLORS, string>;
        }
        let GemHelper: GemHelper;

        namespace GemDatabase {
            type GemNumberStyle = "PERCENT" | "NUMBER" | "NONE" | "PREFIX_PLUS" | "NUMBER_PREFIX" | "PERCENT_PREFIX";

            interface TierData {
                cost: number;
                value: number;
            }

            interface GemRoot {
                stat: string;
                gemColor: el.GEM_COLORS;
                order: number;
                numberStyle: GemNumberStyle;
                langLabel?: string | ig.LangLabel.Data;
                statLangLabel?: string | ig.LangLabel.Data;
                levels: Record<number, TierData>;
                shortDesc?: string;
            }
            
            interface Gem {
                gemRoot: string;
                level: number;
                name?: string;
            }
            
            namespace ParamBonuses {
                interface Params {
                    hp: number,
                    attack: number,
                    defense: number,
                    focus: number,
                    elemFactor: number[];
                }
            }
            interface ParamBonuses {
                params: ParamBonuses.Params;
                modifiers: Record<string, number>;
            }
        }
        interface GemDatabase extends ig.Class, ig.Storage.Listener, ig.Vars.Accessor {
            guiImage: ig.Image;
            gemRoots: Record<string, GemDatabase.GemRoot>;
            gemInventory: el.GemDatabase.Gem[];
            equippedGems: el.GemDatabase.Gem[];
            activeBonuses: el.GemDatabase.ParamBonuses;
            maxPower: number;
            maxSlots: number;
            enabled: boolean;
            bonusSlots: number;
            bonusPower: number;
            specialGemNameEntries: Record<string, string>;

            gemColorToIcon(this: this, color: el.GEM_COLORS): string;
            drawGemLevel(this: this, level: number, height: number): void;

            getGemRoot(this: this, gemRoot: GemDatabase.Gem | string): GemDatabase.GemRoot;
            getGemRootName(this: this, gemRoot: string | el.GemDatabase.GemRoot, withColor?: boolean): string;
            getGemName(this: this, gem: GemDatabase.Gem, withIcon?: boolean, excludeLevel?: boolean): string;
            getGemStatBonusString(this: this, gem: el.GemDatabase.Gem, includeValue?: boolean): string;
            getGemStatBonus(this: this, gem: GemDatabase.Gem): number;
            getGemCost(this: this, gem: GemDatabase.Gem): number;
            getGemLevel(this: this, gem: GemDatabase.Gem): number;
            getTotalGemCosts(this: this): number;
            getGemShortDesc(this: this, gemRoot: GemDatabase.GemRoot | string): string;
            sortGems(this: this, sortMethod: el.GEM_SORT_TYPE): GemDatabase.Gem[];
            
            _validateData(this: this): void;
            
            createGem(this: this, gemRoot: string, level: number): void;
            addGem(this: this, gem: GemDatabase.Gem): void;
            removeGem(this: this, gem: GemDatabase.Gem): void;
            compileGemBonuses(this: this): void;
            equipGem(this: this, gem: GemDatabase.Gem): boolean;
            dequipGemByIndex(this: this, index: number): GemDatabase.Gem | undefined;
            canEquipGem(this: this, gem: GemDatabase.Gem): boolean;
            isValidGem(this: this, gem: GemDatabase.Gem): boolean;
        }
        interface GemDatabaseConstructor extends ImpactClass<GemDatabase> {
            new (): GemDatabase;
        } 
        let GemDatabase: GemDatabaseConstructor;
        let gemDatabase: GemDatabase;


        //#region GUI
        interface GemButton extends sc.ButtonGui {
            gem: el.GemDatabase.Gem;
            gemLevel: number;
            showCost: boolean;
            costNumber: sc.NumberGui;
        }
        interface GemButtonConstructor extends ImpactClass<GemButton> {
            new (gem: el.GemDatabase.Gem, showCost?: boolean): GemButton;
        }
        let GemButton: GemButtonConstructor;

        namespace GemEquipMenu {
            namespace InventoryPanel {
                interface Constructor extends ImpactClass<InventoryPanel> {
                    new (buttonInteract: ig.ButtonInteractEntry): InventoryPanel;
                }
            }
            interface InventoryPanel extends sc.ItemListBox, sc.Model.Observer {
                buttonInteract: ig.ButtonInteractEntry;
                //costText: sc.TextGui;
                sortMethod: el.GEM_SORT_TYPE;
                //gemSelector: el.GemSelectorGui;

                showMenu(this: this): void;
                hideMenu(this: this): void;
                _addListItems(this: this, refocus?: boolean): void;
            }

            namespace EquippedGemsPanel {
                namespace Entry {
                    interface GemIcon {
                        gfx: ig.Image;
                        x: number;
                        y: number;
                    }
                }

                interface Entry extends ig.FocusGui {
                    mainText: sc.TextGui;
                    effectText: sc.TextGui;
                    costText: sc.TextGui;
                    gfx: ig.Image;
                    ninepatch: ig.NinePatch;
                    colorNinepatch: Partial<Record<el.GEM_COLORS, ig.NinePatch>>;
                    gemIcons: Partial<Record<el.GEM_COLORS, Entry.GemIcon>>;
                    gem?: el.GemDatabase.Gem;
                    id: number;
                    dequipSound: ig.Sound;

                    setGem(this: this, gem?: el.GemDatabase.Gem): void;
                    updateText(this: this): void;
                }
                interface EntryConstructor extends ImpactClass<Entry> {
                    new (gem?: el.GemDatabase.Gem): Entry;
                }
            }
            interface EquippedGemsPanel extends sc.MenuPanel, sc.Model.Observer {
                buttonGroup: sc.ButtonGroup;
                equipButtons: EquippedGemsPanel.Entry[];
                costText: sc.TextGui;
                costValues: sc.TextGui;

                updateGemEntries(this: this): void;
                show(this: this): void;
                hide(this: this): void;
            }
            interface EquippedGemsPanelConstructor extends ImpactClass<EquippedGemsPanel> {
                new (buttonInteract: ig.ButtonInteractEntry): EquippedGemsPanel;

                Entry: EquippedGemsPanel.EntryConstructor
            }

            interface Constructor extends ImpactClass<GemEquipMenu> {
                new (): el.GemEquipMenu;
    
                InventoryPanel: GemEquipMenu.InventoryPanel.Constructor;
                EquippedGemsPanel: GemEquipMenu.EquippedGemsPanelConstructor;
            }
        }

        interface GemEquipMenu extends sc.BaseMenu {
            rightPanel: el.GemEquipMenu.InventoryPanel;
            leftPanel: el.GemEquipMenu.EquippedGemsPanel;
            selectorPanel: el.GemSelectorGui;
            infoPanel: el.GemDetailPanel;

            buttonInteract: ig.ButtonInteractEntry;
            sortHotkey: sc.ButtonGui;
            sortMenu: sc.SortMenu;
            helpHotkey: sc.ButtonGui;
            helpGui: sc.HelpScreen;

            onSort(this: this, button: ig.FocusGui): void;
            onSortPress(this: this): void;
            onHelpPress(this: this): void;
            createHelpGui(this: this): void;
            updateSortText(this: this, textPath: string): void;
            addHotkeys(this: this): void;
            commitHotkeys(this: this): void;
        }
        let GemEquipMenu: GemEquipMenu.Constructor;

        namespace GemSelectorGui {
            interface Constructor extends ImpactClass<GemSelectorGui> {
                new (buttonInteract: ig.ButtonInteractEntry): GemSelectorGui;
            }

            interface HeightTransition {
                startHeight: number;
                targetHeight: number;
                time: number;
                timeFunction: KeySpline;
                timer: number;
            }
        }
        interface GemSelectorGui extends ig.GuiElementBase, sc.Model.Observer {
            ninepatch: ig.NinePatch;
            buttonGroup: sc.ButtonGroup;
            buttonInteract: ig.ButtonInteractEntry;
            buttons: el.GemButton[];
            heightTransition: GemSelectorGui.HeightTransition | undefined;
            active: boolean;
            costText: sc.TextGui;

            showSelector(this: this, gemRootKey: string): void;
            hide(this: this): void;
            clearButtons(this: this): void;
            doHeightTransition(this: this, height: number, time: number): void;
        }
        let GemSelectorGui: GemSelectorGui.Constructor;

        namespace GemInventoryEntry {
            interface Constructor extends ImpactClass<GemInventoryEntry> {
                new (root: string): GemInventoryEntry;
            }
        }
        interface GemInventoryEntry extends sc.ButtonGui {
            gemRoot: string;
        }
        let GemInventoryEntry: GemInventoryEntry.Constructor;
        
        namespace GemDetailPanel {
            interface Constructor extends ImpactClass<GemDetailPanel> {
                new (): GemDetailPanel;

                Icon: Icon.Constructor;
            }

            namespace Icon {
                interface Constructor extends ImpactClass<Icon> {
                    new (): Icon;
                }
            }
            interface Icon extends ig.GuiElementBase {
                gfx: ig.Image;
            }
        }
        interface GemDetailPanel extends ig.GuiElementBase, sc.Model.Observer {
            ninepatch: ig.NinePatch;
            mainText: sc.TextGui;
            descText: sc.TextGui;
            icon: el.GemDetailPanel.Icon;
            show(this: this): void;
            hide(this: this): void;
            updateInformation(this: this, gemRoot: string): void;
        }
        let GemDetailPanel: GemDetailPanel.Constructor;
        //#endregion GUI
    }
}