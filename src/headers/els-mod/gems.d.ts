export {};

declare global {
    namespace ig {
        namespace Database {
            interface Data {
                "el-gems": EL_Gems;
            }

            namespace EL_Gems {
                interface GemType {
                    stat: string;
                    gemColor: keyof typeof el.GEM_COLORS;
                    valueIncrease?: number;
                    values?: number[];
                    costs: number[];
                }
            }
            interface EL_Gems {
                gemTypes: EL_Gems.GemType[];
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

        interface GemHelper {
            gemColorToIcon: Record<el.GEM_COLORS, string>;
        }
        var GemHelper: GemHelper;

        namespace GemDatabase {
            interface GemEntry {
                stat: string;
                gemColor: el.GEM_COLORS;
                values: number[];
                costs: number[];
            }

            interface Gem {
                gemRoot: string;
                level: number;
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
        interface GemDatabase extends ig.Class, ig.Storage.Listener {
            guiImage: ig.Image;
            gems: Record<string, GemDatabase.GemEntry>;
            gemInventory: el.GemDatabase.Gem[];
            equippedGems: el.GemDatabase.Gem[];
            activeBonuses: el.GemDatabase.ParamBonuses;
            maxPower: number;
            maxSlots: number;

            gemColorToIcon(this: this, color: el.GEM_COLORS): string;
            drawGemLevel(this: this, level: number, height: number): void;

            getGemRoot(this: this, gem: el.GemDatabase.Gem): el.GemDatabase.GemEntry;
            getGemName(this: this, gem: GemDatabase.Gem, withIcon?: boolean): string;
            getGemStatBonusString(this: this, gem: GemDatabase.Gem, includeValue?: boolean): string;
            getGemCost(this: this, gem: el.GemDatabase.Gem): number;
            getTotalGemCosts(this: this): number;
            
            createGem(this: this, gemRoot: string, level: number): void;
            addGem(this: this, gem: el.GemDatabase.Gem): void;
            removeGem(this: this, gem: GemDatabase.Gem): void;
            compileGemBonuses(this: this): void;
            equipGem(this: this, gem: GemDatabase.Gem): boolean;
            dequipGemByIndex(this: this, index: number): el.GemDatabase.Gem | undefined;

        }
        interface GemDatabaseConstructor extends ImpactClass<GemDatabase> {
            new (): GemDatabase;
        } 
        var GemDatabase: GemDatabaseConstructor;
        var gemDatabase: GemDatabase;

        //#region GUI
        interface GemButton extends sc.ButtonGui {
            gemColor: el.GEM_COLORS;
            level: number;
            name: string;
        }
        interface GemButtonConstructor extends ImpactClass<GemButton> {
            new (gem: el.GemDatabase.Gem): GemButton;
        }
        var GemButton: GemButtonConstructor;

        namespace GemEquipMenu {
            interface RightPanel extends sc.ItemListBox, sc.Model.Observer {
                buttonInteract: ig.ButtonInteractEntry;

                showMenu(this: this): void;
                hideMenu(this: this): void;
                _addListItems(this: this): void;
            }
            interface RightPanelConstructor extends ImpactClass<RightPanel> {
                new (buttonInteract: ig.ButtonInteractEntry): RightPanel;
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
        }

        interface GemEquipMenu extends sc.BaseMenu {
            rightPanel: el.GemEquipMenu.RightPanel;
            centerPanel: el.GemEquipMenu.EquippedGemsPanel;
            buttonInteract: ig.ButtonInteractEntry;
        }
        interface GemEquipMenuConstructor extends ImpactClass<GemEquipMenu> {
            new (): el.GemEquipMenu;

            //TODO: give these better names
            RightPanel: GemEquipMenu.RightPanelConstructor;
            EquippedGemsPanel: GemEquipMenu.EquippedGemsPanelConstructor;
            LeftPanel: void;
        }
        var GemEquipMenu: GemEquipMenuConstructor;
        //#endregion GUI

    }
}