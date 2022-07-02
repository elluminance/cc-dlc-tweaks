export {};

declare global {
    namespace sc {
        enum EL_GEM_TYPES {
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

        //#region GUI
        interface EquipBodyPartContainer {
            gemButton: sc.ButtonGui;
        }

        enum MENU_SUBMENU {
            EL_GEM_EQUIP = "EL_GEM_EQUIP"
        }

        interface EL_GemButton extends sc.ButtonGui {
        }
        interface EL_GemButtonConstructor extends ImpactClass<EL_GemButton> {
            new (gemType: sc.EL_GEM_TYPES, level: number, text: string): EL_GemButton;
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