export default function () {
    
    const ENTRY_SIZE = 32;
    const MAX_GEMS = 7;
    const mainGuiGfx = new ig.Image("media/gui/el-mod-gui.png");

    let temp = [
        { gemRoot: "ATTACK", level: 3 },
        { gemRoot: "DEFENSE", level: 1 },
        { gemRoot: "FOCUS", level: 5 },
        { gemRoot: "MAXHP", level: 4 },
        { gemRoot: "NEUTRAL_RESISTANCE", level: 1 },
        { gemRoot: "HEAT_RESISTANCE", level: 2 },
        { gemRoot: "COLD_RESISTANCE", level: 6 },
    ]

    el.GemButton = sc.ButtonGui.extend({
        level: 0,
        init(gem) {
            this.parent(el.gemDatabase.getGemName(gem), 150, true, sc.BUTTON_TYPE.ITEM)
            this.level = gem.level;

            if (this.level > 0) {
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
        centerPanel: null,
        buttonInteract: null,

        init() {
            this.parent();
            this.hook.localAlpha = 0.8;
            this.hook.pauseGui = true;
            this.hook.size.x = ig.system.width;
            this.hook.size.y = ig.system.height;

            this.rightPanel = new el.GemEquipMenu.RightPanel(sc.menu.buttonInteract);
            this.centerPanel = new el.GemEquipMenu.EquippedGemsPanel(sc.menu.buttonInteract);

            this.addChildGui(this.rightPanel);
            this.addChildGui(this.centerPanel);
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

    el.GemEquipMenu.EquippedGemsPanel = sc.MenuPanel.extend({
        buttonGroup: null,
        equipButtons: [],

        init(buttonInteract) {
            this.parent(sc.MenuPanelType.SQUARE);
            this.setSize(202, (ENTRY_SIZE + 1) * MAX_GEMS + 1);
            this.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_CENTER)
            this.buttonGroup = new sc.ButtonGroup;
            //this.test = new el.GemEquipMenu.EquippedGemsPanel.Entry();
            let offset = 1, button: el.GemEquipMenu.EquippedGemsPanel.Entry;
            for(let i = 0; i < 7; i++) {
                button = new el.GemEquipMenu.EquippedGemsPanel.Entry(temp[i]);
                button.setPos(0, offset);
                button.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
                offset += button.hook.size.y + 1;

                this.equipButtons.push(button);
                this.buttonGroup.addFocusGui(button);
                this.addChildGui(button);
            }
            //this.addChildGui(this.test);
            //this.buttonGroup.addFocusGui(this.test);
            buttonInteract.addParallelGroup(this.buttonGroup);
        }
    })


    el.GemEquipMenu.EquippedGemsPanel.Entry = ig.FocusGui.extend({
        mainText: null,
        effectText: null,
        costText: null,
        gfx: mainGuiGfx,
        ninepatch: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 18,
            height: 2,
            bottom: 8,

            left: 8,
            width: 16,
            right: 8,

            offsets: {
                default: {
                    x: 0,
                    y: 24
                },
                focus: {
                    x: 32,
                    y: 24
                },
                inactive: {
                    x: 64,
                    y: 24
                }
            }
        }),
        // yes, i know i could use a single ninepatch with multiple "modes"
        // but this makes it easier for mod devs to add their own gems if they wanted
        colorNinepatch: {
            [el.GEM_COLORS.RUBY]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32,
                        y: 52,
                    }
                }
            }),
            [el.GEM_COLORS.GARNET]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32 + 16,
                        y: 52,
                    }
                }
            }),
            [el.GEM_COLORS.DIAMOND]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32 + 16 * 2,
                        y: 52,
                    }
                }
            }),
            [el.GEM_COLORS.MOONSTONE]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32 + 16 * 3,
                        y: 52,
                    }
                }
            }),
            [el.GEM_COLORS.CITRINE]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32 + 16 * 4,
                        y: 52,
                    }
                }
            }),
            [el.GEM_COLORS.TOPAZ]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32 + 16 * 5,
                        y: 52,
                    }
                }
            }),

            [el.GEM_COLORS.AMETHYST]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32,
                        y: 52 + 16,
                    }
                }
            }),
            [el.GEM_COLORS.EMERALD]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32 + 16,
                        y: 52 + 16,
                    }
                }
            }),
            [el.GEM_COLORS.LAPIS_LAZULI]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32 + 16 * 2,
                        y: 52 + 16,
                    }
                }
            }),
            [el.GEM_COLORS.AQUAMARINE]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32 + 16 * 3,
                        y: 52 + 16,
                    }
                }
            }),
            [el.GEM_COLORS.ONXY]: new ig.NinePatch("media/gui/el-mod-gui.png", {
                top: 7,
                height: 2,
                bottom: 7,

                left: 7,
                width: 2,
                right: 7,

                offsets: {
                    default: {
                        x: 32 + 16 * 4,
                        y: 52 + 16,
                    }
                }
            }),
        },
        gemIcons: {
            [el.GEM_COLORS.DEFAULT]: { gfx: mainGuiGfx, x: 11 * 0, y: 12 },
            [el.GEM_COLORS.RUBY]: { gfx: mainGuiGfx, x: 11 * 1, y: 12 },
            [el.GEM_COLORS.GARNET]: { gfx: mainGuiGfx, x: 11 * 2, y: 12 },
            [el.GEM_COLORS.DIAMOND]: { gfx: mainGuiGfx, x: 11 * 3, y: 12 },
            [el.GEM_COLORS.MOONSTONE]: { gfx: mainGuiGfx, x: 11 * 4, y: 12 },
            [el.GEM_COLORS.CITRINE]: { gfx: mainGuiGfx, x: 11 * 5, y: 12 },
            [el.GEM_COLORS.TOPAZ]: { gfx: mainGuiGfx, x: 11 * 6, y: 12 },
            [el.GEM_COLORS.AMETHYST]: { gfx: mainGuiGfx, x: 11 * 7, y: 12 },
            [el.GEM_COLORS.EMERALD]: { gfx: mainGuiGfx, x: 11 * 8, y: 12 },
            [el.GEM_COLORS.LAPIS_LAZULI]: { gfx: mainGuiGfx, x: 11 * 9, y: 12 },
            [el.GEM_COLORS.AQUAMARINE]: { gfx: mainGuiGfx, x: 11 * 10, y: 12 },
            [el.GEM_COLORS.ONXY]: { gfx: mainGuiGfx, x: 11 * 11, y: 12 },
        },

        init(gem) {
            this.parent();
            this.gem = gem!;

            //this.gem = { gemRoot: "ATTACK", level: 3 }
            this.setSize(200, ENTRY_SIZE);
            this.mainText = new sc.TextGui("");
            this.mainText.setPos(24, 2)

            this.effectText = new sc.TextGui("", {
                font: sc.fontsystem.smallFont,
            });
            this.effectText.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_BOTTOM);
            this.effectText.setPos(24, 2);

            this.costText = new sc.TextGui("", {
                font: sc.fontsystem.smallFont,
            });
            this.costText.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_BOTTOM);
            this.costText.setPos(10, 2);

            this.addChildGui(this.mainText);
            this.addChildGui(this.effectText);
            this.addChildGui(this.costText);

            this.updateText();
        },

        updateText() {
            this.mainText.setText(el.gemDatabase.getGemName(this.gem));
            this.effectText.setText(`\\c[4]\\i[el-gray-arrow]${el.gemDatabase.getGemStatBonusString(this.gem, true)}`);
            this.costText.setText(`${ig.lang.get("sc.gui.el-gems.equip-entry.cost-text").replace("[!]", el.gemDatabase.getGemCost(this.gem).toString())}`);
        },

        updateDrawables(renderer) {
            const gemRoot = el.gemDatabase.getGemRoot(this.gem)
            const gemColor = gemRoot.gemColor;
            const gemIcon = this.gemIcons[gemColor] ?? this.gemIcons[el.GEM_COLORS.DEFAULT]!
            
            // main background
            this.ninepatch.draw(renderer, this.hook.size.x, this.hook.size.y, this.focus ? "focus" : "default");

            // colors the button
            renderer.addTransform().setAlpha(0.15)
            this.colorNinepatch[gemColor]?.drawComposite(renderer, this.hook.size.x, this.hook.size.y, "default", "lighter")
            renderer.undoTransform();

            // adds the gem slot
            renderer.addGfx(this.gfx, 6, this.hook.size.y / 2 - 8, 96 + (this.focus ? 16 : 0), 24, 16, 16);
            
            // adds the gem icon
            renderer.addGfx(gemIcon.gfx, 8, this.hook.size.y / 2 - 6, gemIcon.x, gemIcon.y, 11, 11)

            // adds the gem level
            if (this.gem.level) renderer.addGfx(this.gfx, 13, this.hook.size.y / 2 + 1, 23 + 8 * (this.gem.level - 1), 0, 7, 5)
        },
    })

    sc.modUtils.registerMenu("EL_GEM_EQUIP", el.GemEquipMenu, "el-gemEquip")
}