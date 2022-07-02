export {};

declare global {
    namespace ig {
        namespace Database {
            interface Data {
                gemTypes: ""
            }

            namespace EL_Gems {
                interface GemTypes {
                    type: "PARAM" | "MODIFIER";
                    stat: string;
                    gemType: keyof typeof sc.EL_GEM_COLOR;
                    values: number[];
                    cost: number[];
                }
            }
            interface EL_Gems {

            }
        }
    }
    namespace sc {
        enum EL_GEM_COLOR {
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
            ONXY = 11,
        }

        interface EL_GemHelper {
            gemColorToIcon: Record<EL_GEM_COLOR, string>;
            drawGemLevel(level: number, height: number): void;
        }
        var EL_GemHelper: EL_GemHelper;

        //#region GUI
        interface EquipBodyPartContainer {
            gemButton: sc.ButtonGui;
        }

        enum MENU_SUBMENU {
            EL_GEM_EQUIP = "EL_GEM_EQUIP"
        }

        interface EL_GemButton extends sc.ButtonGui {
            gemColor: sc.EL_GEM_COLOR;
            level: number;
            name: string;
        }
        interface EL_GemButtonConstructor extends ImpactClass<EL_GemButton> {
            new (gemType: sc.EL_GEM_COLOR, level: number, text: string): EL_GemButton;
        }
        var EL_GemButton: EL_GemButtonConstructor;

        namespace EL_GemEquipMenu {
            interface RightPanel extends sc.ItemListBox {
                buttonInteract: ig.ButtonInteractEntry;

                showMenu(this: this): void;
                hideMenu(this: this): void;
            }
            interface RightPanelConstructor extends ImpactClass<RightPanel> {
                new (buttonInteract: ig.ButtonInteractEntry): RightPanel;
            }
        }

        interface EL_GemEquipMenu extends sc.BaseMenu {
            rightPanel: sc.EL_GemEquipMenu.RightPanel;
            buttonInteract: ig.ButtonInteractEntry;
        }
        interface EL_GemEquipMenuConstructor extends ImpactClass<EL_GemEquipMenu> {
            new (): sc.EL_GemEquipMenu;

            RightPanel: EL_GemEquipMenu.RightPanelConstructor;
        }
        var EL_GemEquipMenu: EL_GemEquipMenuConstructor;
        //#endregion GUI
    }
}