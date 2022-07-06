export default function() {
    el.GemButton = sc.ButtonGui.extend({
        level: 0,
        init(gem) {
            this.parent(el.gemDatabase.getGemName(gem), 150, true, sc.BUTTON_TYPE.ITEM)
            this.level = gem.level;

            if(this.level > 0) {
                this.textChild.setDrawCallback((_width, height) => {
                    el.gemDatabase.drawGemLevel(this.level, height)
                })
            }
        }
    })

    sc.EquipMenu.inject({
        showMenu(a, b) {
            if (sc.menu.previousMenu == sc.MENU_SUBMENU.EL_GEM_EQUIP) {
                sc.menu.previousMenu = sc.MENU_SUBMENU.STATUS
                sc.menu.moveLeaSprite(0, -101, sc.MENU_LEA_STATE.SMALL, false)
            }
            this.parent(a, b)
        }
    })

    sc.EquipBodyPartContainer.inject({
        init(globalButtons) {
            this.parent(globalButtons);

            this.gemButton = new sc.ButtonGui(`\\i[el-gem-blank-white] ${ig.lang.get("sc.gui.el-gems.gem-equip-button")}`);
            this.gemButton.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_BOTTOM)
            this.gemButton.setPos(0, 8)
            this.gemButton.data = ig.lang.get("sc.gui.el-gems.gem-equip-button-description")
            this.gemButton.hook.transitions = {
                DEFAULT: {
                    state: {},
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                HIDDEN: {
                    state: {
                        alpha: 0,
                        offsetY: -(160 + (sc.options.hdMode ? 25 : 3))
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            this.gemButton.onButtonPress = () => {
                sc.menu.pushMenu(sc.MENU_SUBMENU.EL_GEM_EQUIP);
            }
            this.buttonGroup.addFocusGui(this.gemButton, 0, 6)
            this.addChildGui(this.gemButton)
        },

        _moveButtons(bodypart) {
            this.parent(bodypart);
            this.gemButton.doStateTransition(bodypart === sc.MENU_EQUIP_BODYPART.NONE ? "DEFAULT" : "HIDDEN");
        }
    })

    el.GemEquipMenu = sc.BaseMenu.extend({
        rightPanel: null,
        buttonInteract: null,

        init() {
            this.parent();
            this.hook.localAlpha = 0.8;
            this.hook.pauseGui = true;
            this.hook.size.x = ig.system.width;
            this.hook.size.y = ig.system.height;

            this.rightPanel = new el.GemEquipMenu.RightPanel(sc.menu.buttonInteract);
            this.addChildGui(this.rightPanel);
        },

        showMenu() {
            sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.HIDDEN, true);
            ig.interact.setBlockDelay(0.2);
            this.doStateTransition("DEFAULT")
            this.rightPanel.showMenu();
            sc.menu.buttonInteract.pushButtonGroup(this.rightPanel.list.buttonGroup)
        },

        hideMenu() {
            this.doStateTransition("HIDDEN")
            this.rightPanel.hideMenu();
            sc.menu.buttonInteract.removeButtonGroup(this.rightPanel.list.buttonGroup);
            ig.interact.removeEntry(this.buttonInteract);
        }
    })

    el.GemEquipMenu.RightPanel = sc.ItemListBox.extend({
        init(buttonInteract) {
            this.buttonInteract = buttonInteract;

            this.parent(1, true, this.buttonInteract);
            this.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
            this.setPos(2, 28);
            this.setSize(150 + 5, 250)
            this.hook.transitions = {
                DEFAULT: {
                    state: {},
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                },
                HIDDEN: {
                    state: {
                        alpha: 0,
                        offsetX: -(170 + (sc.options.hdMode ? 25 : 3))
                    },
                    time: 0.2,
                    timeFunction: KEY_SPLINES.LINEAR
                }
            };
            //@ts-ignore
            window.ffff = this;
        },

        showMenu() {
            this.doStateTransition("DEFAULT");
        },

        hideMenu() {
            this.doStateTransition("HIDDEN");
        },

        addButton(gui) {
            //@ts-ignore stupid "this" context
            this.parent(gui);
            gui.hook.pos.x += 1;
        },
    })

    sc.modUtils.registerMenu("EL_GEM_EQUIP", el.GemEquipMenu, "el-gemEquip")
}