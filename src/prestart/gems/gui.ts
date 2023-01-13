const ENTRY_SIZE = 32;
const MAX_GEMS = 7;
const mainGuiGfx = new ig.Image("media/gui/el-mod-gui.png");
const vanillaGuiGfx = new ig.Image("media/gui/buttons.png")

el.GEM_SORT_TYPE = {
    ORDER: 1,
    LEVEL: 2,
    NAME: 3,
    COST: 4,
}

function getStatLangString(stat: string) {
    let titlePath: string, descPath: string;

    switch (stat) {
        case "STAT_HP":
            descPath = titlePath = "maxhp";
            break;
        case "STAT_ATTACK":
            descPath = titlePath = "atk";
            break;
        case "STAT_DEFENSE":
            descPath = titlePath = "def";
            break;
        case "STAT_FOCUS":
            descPath = titlePath = "foc";
            break;
        case "NEUTRAL_RESIST":
            descPath = titlePath = "neutral";
            break;
        case "HEAT_RESIST":
            descPath = titlePath = "heat";
            break;
        case "COLD_RESIST":
            descPath = titlePath = "cold";
            break;
        case "SHOCK_RESIST":
            descPath = titlePath = "shock";
            break;
        case "WAVE_RESIST":
            descPath = titlePath = "wave";
            break;
        default:
            titlePath = `modifier.${stat}`;
            descPath = stat;
            break;
    }
    return {
        title: `sc.gui.menu.equip.${titlePath}`,
        description: `sc.gui.menu.equip.descriptions.${descPath}`,
    }
}

el.GemButton = sc.ButtonGui.extend({
    gem: null,
    costNumber: null,
    gemLevel: 0,

    init(gem, showCost) {
        this.showCost = showCost!;

        this.parent(el.gemDatabase.getGemName(gem, true), this.showCost ? 176 : 150, true, sc.BUTTON_TYPE.ITEM)

        this.gem = gem;

        this.costNumber = new sc.NumberGui(99);
        this.costNumber.setNumber(el.gemDatabase.getGemCost(gem));
        this.costNumber.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.costNumber.setPos(6, 7);

        if (this.showCost) {
            this.bgGui.hook.size.x -= 26;
            this.addChildGui(this.costNumber);
        }

        this.textChild.setDrawCallback((_width, height) => {
            el.gemDatabase.drawGemLevel(el.gemDatabase.getGemLevel(gem), height)
        })
    },

    updateDrawables(renderer) {
        if (this.showCost) {
            renderer.addGfx(vanillaGuiGfx, this.hook.size.x - 26, 0, this.focus ? 62 : 18, 45, 22, 1)
        }
    },
})

//#region Vanilla Injections
sc.EquipMenu.inject({
    showMenu(a, b) {
        if (sc.menu.previousMenu === sc.MENU_SUBMENU.EL_GEM_EQUIP) {
            sc.menu.previousMenu = sc.MENU_SUBMENU.STATUS
            sc.menu.moveLeaSprite(0, -101, sc.MENU_LEA_STATE.SMALL, false)
        }
        this.parent(a, b)
    },

    hideMenu(_, nextSubmenu) {
        if (nextSubmenu === sc.MENU_SUBMENU.EL_GEM_EQUIP) {
            this.exitMenu(nextSubmenu);
        } else this.parent(_, nextSubmenu)
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
    },

    _moveButtons(bodypart) {
        this.parent(bodypart);
        this.gemButton.doStateTransition(bodypart === sc.MENU_EQUIP_BODYPART.NONE ? "DEFAULT" : "HIDDEN");
    },

    showMenu() {
        this.parent();

        if (el.gemDatabase.enabled) {
            this.addChildGui(this.gemButton)
        }
    }
})
//#endregion

el.GemEquipMenu = sc.BaseMenu.extend({
    rightPanel: null,
    leftPanel: null,
    buttonInteract: null,
    sortHotkey: null,
    sortMenu: null,
    helpHotkey: null,

    init() {
        this.parent();
        this.hook.localAlpha = 0.8;
        this.hook.pauseGui = true;
        this.hook.size.x = ig.system.width;
        this.hook.size.y = ig.system.height;

        this.rightPanel = new el.GemEquipMenu.RightPanel(sc.menu.buttonInteract);
        this.leftPanel = new el.GemEquipMenu.EquippedGemsPanel(sc.menu.buttonInteract);

        this.addChildGui(this.rightPanel);
        this.addChildGui(this.leftPanel);

        //#region Hotkeys
        this.sortMenu = new sc.SortMenu(this.onSort.bind(this));
        this.sortMenu.addButton("auto", el.GEM_SORT_TYPE.ORDER, 0);
        this.sortMenu.addButton("name", el.GEM_SORT_TYPE.NAME, 1);
        this.sortMenu.addButton("level", el.GEM_SORT_TYPE.LEVEL, 2);
        this.sortMenu.addButton("el-gem-cost", el.GEM_SORT_TYPE.COST, 3);

        this.sortHotkey = new sc.ButtonGui("", void 0, true, sc.BUTTON_TYPE.SMALL)
        this.sortHotkey.keepMouseFocus = true;
        this.sortHotkey.hook.transitions = {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.EASE
            },
            HIDDEN: {
                state: {
                    offsetY: -this.sortHotkey.hook.size.y
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        };
        this.sortHotkey.onButtonPress = this.onSortPress.bind(this);
        this.updateSortText(ig.lang.get("sc.gui.menu.sort.auto"));

        this.helpHotkey = new sc.ButtonGui(`\\i[help]${ig.lang.get("sc.gui.menu.hotkeys.help")}`, void 0, true, sc.BUTTON_TYPE.SMALL);
        this.helpHotkey.keepMouseFocus = true;
        this.helpHotkey.hook.transitions = {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.EASE
            },
            HIDDEN: {
                state: {
                    offsetY: -this.sortHotkey.hook.size.y
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        };
        this.helpHotkey.onButtonPress = this.onHelpPress.bind(this);

        this.helpGui = new sc.HelpScreen(this, ig.lang.get("sc.gui.menu.help-texts.el-gem-equip.title"), ig.lang.get("sc.gui.menu.help-texts.el-gem-equip.pages"), this.commitHotkeys.bind(this), true);
        this.helpGui.hook.zIndex = 15E4;
        this.helpGui.hook.pauseGui = true;
        //#endregion

    },

    showMenu() {
        sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.HIDDEN, true);
        ig.interact.setBlockDelay(0.2);
        this.doStateTransition("DEFAULT");

        this.rightPanel.showMenu();
        this.leftPanel.show();

        this.addHotkeys();

        sc.menu.buttonInteract.pushButtonGroup(this.rightPanel.list.buttonGroup)
    },

    hideMenu() {
        this.doStateTransition("HIDDEN");
        this.rightPanel.hideMenu();
        this.leftPanel.hide();

        sc.menu.buttonInteract.removeButtonGroup(this.rightPanel.list.buttonGroup);
        sc.menu.buttonInteract.removeGlobalButton(this.sortHotkey);
        sc.menu.buttonInteract.removeGlobalButton(this.helpHotkey);
        ig.interact.removeEntry(this.buttonInteract);
    },

    onSort(button) {
        if ((button as any).data) {
            this.sortMenu.hideSortMenu();
            sc.menu.sortList(button);

            this.updateSortText((button as any).text)
        }
    },

    onSortPress() {
        if (this.sortMenu.active) this.sortMenu.hideSortMenu();
        else {
            ig.gui.addGuiElement(this.sortMenu);
            this.sortMenu.showSortMenu(this.sortHotkey);
            sc.menu.updateHotkeys();
        }
    },

    onHelpPress() {
        sc.menu.removeHotkeys();
        ig.gui.addGuiElement(this.helpGui);
        this.helpGui.openMenu();
    },

    addHotkeys() {
        sc.menu.buttonInteract.addGlobalButton(this.sortHotkey, sc.control.menuHotkeyHelp3);
        sc.menu.buttonInteract.addGlobalButton(this.helpHotkey, sc.control.menuHotkeyHelp);
        this.commitHotkeys();
    },

    commitHotkeys() {
        sc.menu.addHotkey(() => this.sortHotkey);
        sc.menu.addHotkey(() => this.helpHotkey);
        sc.menu.commitHotkeys();
    },

    updateSortText(text) {
        this.sortHotkey.setText(`\\i[help3]${ig.lang.get("sc.gui.menu.item.sort-title")}: \\c[3]${text}\\c[0]`)
    }
})

el.GemEquipMenu.RightPanel = sc.ItemListBox.extend({
    buttonInteract: null,
    costText: null,
    sortMethod: el.GEM_SORT_TYPE.ORDER,

    init(buttonInteract) {
        this.buttonInteract = buttonInteract;

        this.parent(1, true, this.buttonInteract);
        this.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.setPos(2, 28);
        this.setSize(180, 250)
        this.hook.transitions = {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            },
            HIDDEN: {
                state: {
                    alpha: 0,
                    offsetX: -(190 + (sc.options.hdMode ? 25 : 3))
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        };

        this.costText = new sc.TextGui(ig.lang.get("sc.gui.el-gems.cost-heading"), {
            font: sc.fontsystem.tinyFont,
        });
        this.costText.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.costText.setPos(5, 0);
        this.addChildGui(this.costText);
    },

    showMenu() {
        this.doStateTransition("DEFAULT");
        sc.menu.moveLeaSprite(0, -101, sc.MENU_LEA_STATE.SMALL, true);
        this._addListItems();
        sc.Model.addObserver(sc.menu, this);
    },

    hideMenu() {
        this.doStateTransition("HIDDEN");
        sc.Model.removeObserver(sc.menu, this)
    },

    modelChanged(model, message, data) {
        if (model === sc.menu) {
            switch (message) {
                case sc.MENU_EVENT.EQUIP_CHANGED:
                    this._addListItems(true);
                    break;
                case sc.MENU_EVENT.SORT_LIST:
                    this.sortMethod = (data as any).data.sortType;
                    this._addListItems();
                    break;
            }
        }
    },

    addButton(gui) {
        //@ts-ignore stupid "this" context
        this.parent(gui);
        gui.hook.pos.x += 1;
    },

    _addListItems(refocus) {
        let lastIndex = 0;
        let toScroll = 0
        if (refocus) {
            lastIndex = this.list.buttonGroup.current.y;
            toScroll = -this.list.box.hook.scroll.y;
        }
        this.list.clear(refocus);
        let gemList = el.gemDatabase.sortGems(this.sortMethod);
        for(let gem of gemList) {
            let button = new el.GemButton(gem, true);
            button.submitSound = undefined;

            button.setActive(el.gemDatabase.canEquipGem(gem));

            button.onButtonPress = () => {
                let equipped = el.gemDatabase.equipGem(gem);
                if (button.active && equipped) {
                    el.gemDatabase.removeGem(gem);
                    sc.BUTTON_SOUND.submit.play();
                } else {
                    sc.BUTTON_SOUND.denied.play();
                }
                sc.Model.notifyObserver(sc.menu, sc.MENU_EVENT.EQUIP_CHANGED);
            }

            this.addButton(button);
        }

        if (refocus) {
            this.list.scrollToY(toScroll, true);
        }
    },
})

el.GemEquipMenu.EquippedGemsPanel = sc.MenuPanel.extend({
    buttonGroup: null,
    equipButtons: [],

    init(buttonInteract) {
        this.parent(sc.MenuPanelType.SQUARE);
        this.setSize(204, (ENTRY_SIZE + 1) * MAX_GEMS + 24);
        this.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_CENTER);
        this.setPos(4, 0);
        this.buttonGroup = new sc.ButtonGroup;

        this.hook.transitions = {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            },
            HIDDEN: {
                state: {
                    alpha: 0,
                    offsetX: -240
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        };

        let offset = 4, button: el.GemEquipMenu.EquippedGemsPanel.Entry;
        for (let i = 0; i < 7; i++) {
            button = new el.GemEquipMenu.EquippedGemsPanel.Entry();
            button.setPos(0, offset);
            button.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
            button.id = i;
            offset += button.hook.size.y + 1;

            this.equipButtons.push(button);
            this.buttonGroup.addFocusGui(button, -1, i);
            this.addChildGui(button);
        }
        buttonInteract.addParallelGroup(this.buttonGroup);

        let line = new sc.LineGui(this.hook.size.x);
        line.setPos(0, offset + 3);
        this.addChildGui(line);

        this.costValues = new sc.TextGui("99/99", { font: sc.fontsystem.smallFont });
        this.costValues.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_BOTTOM);
        this.costValues.setPos(2, 0)

        this.costText = new sc.TextGui(ig.lang.get("sc.gui.el-gems.gui-gem-cost"), {
            font: sc.fontsystem.smallFont,
        })
        this.costText.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_BOTTOM);
        this.costText.setPos(4 + this.costValues.hook.size.x, 0)

        this.costText.annotation = {
            content: {
                title: "sc.gui.menu.help-texts.el-gem-equip.gem-power.title",
                description: "sc.gui.menu.help-texts.el-gem-equip.gem-power.description"
            },
            size: {
                x: this.costValues.hook.size.x + this.costText.hook.size.x + 5,
                y: 14,
            },
            offset: {
                x: -2,
                y: -1
            },
            index: {
                x: 0,
                y: 7
            }
        }

        this.addChildGui(this.costValues);
        this.addChildGui(this.costText);
    },

    updateGemEntries() {
        let index = 0;
        for(let entry of this.equipButtons) {
            if (index >= el.gemDatabase.maxSlots) {
                entry.setActive(false);
                entry.setGem();
            } else {
                entry.setActive(true);
                entry.setGem(el.gemDatabase.equippedGems[index])
            }
            index++;
        }

        this.costValues.setText(`${el.gemDatabase.maxPower - el.gemDatabase.getTotalGemCosts()}/${el.gemDatabase.maxPower}`);
    },

    show() {
        sc.Model.addObserver(sc.menu, this);
        this.updateGemEntries();
        this.doStateTransition("DEFAULT");
    },

    hide() {
        sc.Model.removeObserver(sc.menu, this);
        this.doStateTransition("HIDDEN");
    },

    modelChanged(model, message) {
        if (model === sc.menu) {
            switch (message) {
                case sc.MENU_EVENT.EQUIP_CHANGED:
                    this.updateGemEntries();
                    break;
            }
        }
    },
})

el.GemEquipMenu.EquippedGemsPanel.Entry = ig.FocusGui.extend({
    mainText: null,
    effectText: null,
    costText: null,
    gfx: mainGuiGfx,
    dequipSound: sc.BUTTON_SOUND.submit,
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
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
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
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32 + 22,
                    y: 52,
                }
            }
        }),
        [el.GEM_COLORS.DIAMOND]: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 7,
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32 + 22 * 2,
                    y: 52,
                }
            }
        }),
        [el.GEM_COLORS.MOONSTONE]: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 7,
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32 + 22 * 3,
                    y: 52,
                }
            }
        }),
        [el.GEM_COLORS.CITRINE]: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 7,
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32 + 22 * 4,
                    y: 52,
                }
            }
        }),
        [el.GEM_COLORS.TOPAZ]: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 7,
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32 + 22 * 5,
                    y: 52,
                }
            }
        }),

        [el.GEM_COLORS.AMETHYST]: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 7,
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32,
                    y: 52 + 22,
                }
            }
        }),
        [el.GEM_COLORS.EMERALD]: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 7,
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32 + 22,
                    y: 52 + 22,
                }
            }
        }),
        [el.GEM_COLORS.LAPIS_LAZULI]: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 7,
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32 + 22 * 2,
                    y: 52 + 22,
                }
            }
        }),
        [el.GEM_COLORS.AQUAMARINE]: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 7,
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32 + 22 * 3,
                    y: 52 + 22,
                }
            }
        }),
        [el.GEM_COLORS.ONYX]: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 7,
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32 + 22 * 4,
                    y: 52 + 22,
                }
            }
        }),
        [el.GEM_COLORS.BLOODSTONE]: new ig.NinePatch("media/gui/el-mod-gui.png", {
            top: 7,
            height: 8,
            bottom: 7,

            left: 7,
            width: 8,
            right: 7,

            offsets: {
                default: {
                    x: 32 + 22 * 5,
                    y: 52 + 22,
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
        [el.GEM_COLORS.ONYX]: { gfx: mainGuiGfx, x: 11 * 11, y: 12 },
        [el.GEM_COLORS.BLOODSTONE]: { gfx: mainGuiGfx, x: 11 * 12, y: 12 },
    },

    init(gem) {
        this.parent();
        this.gem = gem!;

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
        if (!this.active) {
            delete this.annotation;
            this.mainText.setText("");
            this.effectText.setText("");
            this.costText.setText("");
        } else if (this.gem) {
            this.mainText.setText(el.gemDatabase.getGemName(this.gem));
            this.effectText.setText(`\\c[4]\\i[el-gray-arrow]${el.gemDatabase.getGemStatBonusString(this.gem, true)}`);
            this.costText.setText(`${ig.lang.get("sc.gui.el-gems.equip-entry.cost-text").replace("[!]", el.gemDatabase.getGemCost(this.gem).toString())}`);
            this.annotation = {
                content: getStatLangString(el.gemDatabase.getGemRoot(this.gem).stat),
                size: {
                    x: "dyn",
                    y: "dyn"
                },
                offset: {
                    x: 0,
                    y: -1,
                },
                index: {
                    x: this.id,
                    y: 0,
                }
            }
        } else {
            delete this.annotation;
            this.mainText.setText("");
            this.effectText.setText("");
            this.costText.setText(`\\c[4]${ig.lang.get("sc.gui.el-gems.equip-entry.cost-text")}`.replace("[!]", "-"))
        }
    },

    setGem(gem) {
        this.gem = gem;
        this.updateText();
    },

    updateDrawables(renderer) {
        let gemRoot = this.gem ? el.gemDatabase.getGemRoot(this.gem) : undefined;
        let gemColor = (this.gem && gemRoot) ? gemRoot.gemColor : undefined;
        let gemIcon = this.gemIcons[gemColor || el.GEM_COLORS.DEFAULT]! ?? this.gemIcons[el.GEM_COLORS.DEFAULT]!;

        // main background
        this.ninepatch.draw(renderer, this.hook.size.x, this.hook.size.y, this.active ? (this.focus ? "focus" : "default") : "inactive");

        if (this.active && this.gem) {
            // colors the button
            renderer.addTransform().setAlpha(0.15)
            this.colorNinepatch[gemColor!]?.drawComposite(renderer, this.hook.size.x, this.hook.size.y, "default", "lighter")
            renderer.undoTransform();
        }

        // adds the gem slot
        renderer.addGfx(this.gfx, 6, this.hook.size.y / 2 - 8, 96 + (this.active ? (this.focus ? 16 : 0) : 32), 24, 16, 16);

        if (this.active && this.gem) {
            // adds the gem icon
            renderer.addGfx(gemIcon.gfx, 8, this.hook.size.y / 2 - 6, gemIcon!.x, gemIcon!.y, 11, 11)

            let level = el.gemDatabase.getGemLevel(this.gem)
            // adds the gem level
            if (level) renderer.addGfx(this.gfx, 13, this.hook.size.y / 2 + 1, 23 + 8 * (level === -1 ? 6 : level - 1), 0, 7, 5)
        }
    },

    onButtonPress() {
        if (this.gem) {
            this.dequipSound.play();
            el.gemDatabase.dequipGemByIndex(this.id);
            el.gemDatabase.addGem(this.gem);
            sc.Model.notifyObserver(sc.menu, sc.MENU_EVENT.EQUIP_CHANGED)
        }
    },

    canPlayFocusSounds() {
        return this.active;
    }
})

sc.modUtils.registerMenu("EL_GEM_EQUIP", el.GemEquipMenu, "el-gemEquip")