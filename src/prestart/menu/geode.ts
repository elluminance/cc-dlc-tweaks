
//#region NPC
//@ts-ignore
sc.NPC_EVENT_TYPE.GEODE = "GEODE"

if (!sc.MAP_INTERACT_ICONS) sc.MAP_INTERACT_ICONS = {}

sc.MAP_INTERACT_ICONS.GEODE = new sc.MapInteractIcon(
    new ig.TileSheet("media/gui/el-mod-map-icons.png", 24, 24, 0, 0),
    { FOCUS: [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0], NEAR: [4], AWAY: [5] },
    0.05
)

ig.ENTITY.NPC.inject({
    setMapInteractIcon(a) {
        this.parent(a)
        if (a.npcEventType === sc.NPC_EVENT_TYPE.GEODE) {
            this.interactEntry.setIcon(sc.MAP_INTERACT_ICONS.GEODE);
        }
    }
})

sc.NpcState.inject({
    init(a, b) {
        this.parent(a, b)
        if ((a as any).event && (a as any).event.geode) {
            let c = {
                name: "NPC EVENT",
                steps: (a as any).event.geode
            }

            this.npcEventObj = new ig.Event(c)
            this.npcEventType = sc.NPC_EVENT_TYPE.GEODE
        }
    }
})

ig.EVENT_STEP.OPEN_GEODE_MENU = ig.EventStepBase.extend({
    init() { },

    start() {
        sc.menu.setDirectMode(true, sc.MENU_SUBMENU.GEODE_OPENING);
        sc.model.enterMenu(true);
        sc.model.prevSubState = sc.GAME_MODEL_SUBSTATE.RUNNING
    }
})
//#endregion NPC



//#region Geode GUI
el.GeodeOpeningGui = sc.BaseMenu.extend({
    ninepatch: new ig.NinePatch("media/gui/menu.png", {
        width: 16,
        height: 9,
        left: 4,
        top: 4,
        right: 4,
        bottom: 4,
        offsets: {
            "default": {
                x: 512,
                y: 457
            }
        }
    }),
    transitions: {
        DEFAULT: {
            state: {},
            time: 0.2,
            timeFunction: KEY_SPLINES.EASE_OUT
        },
        HIDDEN: {
            state: {
                alpha: 0,
                scaleX: 0
            },
            time: 0.2,
            timeFunction: KEY_SPLINES.EASE_IN
        }
    },
    buttonInteract: null,
    buttongroup: null,
    //@ts-ignore
    buttons: {},
    textGui: null,
    geodeText: null,
    geodeAmount: null,
    costText: null,
    costNumber: null,
    rewardGui: null,

    count: 0,
    pricePerGeode: 750,

    init() {
        this.parent()
        this.hook.localAlpha = 0.8;
        this.hook.pauseGui = true;
        this.hook.size.x = ig.system.width;
        this.hook.size.y = ig.system.height;

        this.textGui = new sc.TextGui(ig.lang.get("sc.gui.geode.openTitle"), {
            maxWidth: 315
        });
        this.textGui.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP)
        this.content = new ig.GuiElementBase;
        this.content.addChildGui(this.textGui);
        this.content.setSize(160, 110)

        this.count = 1;
        this.geodeText = new sc.TextGui(`\\i[item-trade-unique]${ig.lang.get("sc.gui.geode.geodeName")}`);
        this.geodeText.setPos(0, 20);
        this.geodeAmount = new sc.NumberGui(99, {
            size: sc.NUMBER_SIZE.TEXT,
            transitionTime: 0.2,
            transitionScale: 1,
        });
        this.geodeAmount.setNumber(this.count, true);
        this.geodeAmount.setPos(144, 24)

        this.costText = new sc.TextGui(`\\i[credit]Cost:`);
        this.costText.setPos(0, 36);
        this.costNumber = new sc.NumberGui(99999, {
            size: sc.NUMBER_SIZE.TEXT,
            signed: true,
            transitionTime: 0.2,
            transitionScale: 1,
            color: sc.GUI_NUMBER_COLOR.RED,
            zeroAsGrey: true
        });
        this.costNumber.setNumber(0, true);
        this.costNumber.setPos(112, 40)

        this.content.addChildGui(this.geodeText);
        this.content.addChildGui(this.geodeAmount);
        this.content.addChildGui(this.costText);
        this.content.addChildGui(this.costNumber);

        this.buttonInteract = new ig.ButtonInteractEntry;
        this.buttongroup = new sc.ButtonGroup;
        this.buttonInteract.pushButtonGroup(this.buttongroup);
        this.buttongroup.addPressCallback(button => {
            (button as sc.ButtonGui).data !== void 0 && this.onButtonCallback(button as sc.ButtonGui)
        });

        let xOffset = 0;
        //#region value buttons
        this.buttons.bigDecrement = new sc.ButtonGui("-10", 32);
        this.buttons.bigDecrement.data = {
            type: "changeValue",
            value: -10
        };
        this.buttons.bigDecrement.setPos(xOffset, 60)
        xOffset += this.buttons.bigDecrement.hook.size.x + 4
        this.buttongroup.addFocusGui(this.buttons.bigDecrement, 0, 0)
        this.content.addChildGui(this.buttons.bigDecrement);

        this.buttons.decrement = new sc.ButtonGui("-1", 32);
        this.buttons.decrement.data = {
            type: "changeValue",
            value: -1
        };
        this.buttons.decrement.setPos(xOffset, 60)
        xOffset += this.buttons.decrement.hook.size.x + 4
        this.buttongroup.addFocusGui(this.buttons.decrement, 1, 0)
        this.content.addChildGui(this.buttons.decrement);

        xOffset = this.content.hook.size.x

        this.buttons.bigIncrement = new sc.ButtonGui("+10", 32);
        this.buttons.bigIncrement.data = {
            type: "changeValue",
            value: 10
        };
        xOffset -= this.buttons.bigIncrement.hook.size.x
        this.buttons.bigIncrement.setPos(xOffset, 60)
        this.buttongroup.addFocusGui(this.buttons.bigIncrement, 3, 0)
        this.content.addChildGui(this.buttons.bigIncrement);

        this.buttons.increment = new sc.ButtonGui("+1", 32);
        this.buttons.increment.data = {
            type: "changeValue",
            value: 1
        };
        xOffset -= this.buttons.increment.hook.size.x + 4
        this.buttons.increment.setPos(xOffset, 60)
        this.buttongroup.addFocusGui(this.buttons.increment, 2, 0)
        this.content.addChildGui(this.buttons.increment);
        //#endregion value buttons

        this.openGeodesButton = new sc.ButtonGui(ig.lang.get("sc.gui.geode.openGeodes"))
        this.openGeodesButton.data = {
            type: "openGeodes"
        }
        this.openGeodesButton.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_BOTTOM)
        this.openGeodesButton.submitSound = sc.BUTTON_SOUND.shop_cash;
        let i = 4;
        while (i-- > 0) this.buttongroup.addFocusGui(this.openGeodesButton, i, 1);
        this.content.addChildGui(this.openGeodesButton);

        this.msgBox = new sc.CenterBoxGui(this.content);
        this.msgBox.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_CENTER);

        this.rewardGui = new el.GeodeRewardsGui;
        this.rewardGui.doStateTransition("HIDDEN", true);
        this.addChildGui(this.rewardGui);

        this.addChildGui(this.msgBox);
        this.doStateTransition("HIDDEN", true)
        this._updateCounters();

        this.generateRewardTable();
    },

    showMenu() {
        sc.menu.buttonInteract.pushButtonGroup(this.buttongroup);
        sc.menu.pushBackCallback(this.onBackButtonPress.bind(this));
        sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.HIDDEN);
        sc.model.addChoiceGui(this)
        ig.interact.setBlockDelay(0.2);
        this.doStateTransition("DEFAULT")
        this.msgBox.doStateTransition("DEFAULT")
    },

    hideMenu() {
        this.removeObservers();
        ig.interact.removeEntry(this.buttonInteract);
        sc.model.removeChoiceGui(this)
        sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.LARGE);
        this.doStateTransition("HIDDEN")
        this.msgBox.doStateTransition("HIDDEN")
    },

    onButtonCallback(button) {
        switch ((button.data as any).type) {
            case "changeValue":
                this.incrementValue((button.data as any).value)
                break;
            case "openGeodes":
                this.openGeodes();
                break;
        }
    },

    onBackButtonPress() {
        sc.menu.popBackCallback();
        sc.menu.popMenu()
    },

    getMaxGeodes() {
        return Math.min(Math.floor(sc.model.player.credit / this.pricePerGeode!), sc.model.player.getItemAmount("el-item-geode"));
    },

    incrementValue(change) {
        this.count += change;
        this._updateCounters()
    },

    _updateCounters() {
        this.count = this.count.limit(1, this.getMaxGeodes());
        if (this.count <= 1) {
            this.buttons.decrement.setActive(false)
            this.buttons.bigDecrement.setActive(false)
        } else {
            this.buttons.decrement.setActive(true)
            this.buttons.bigDecrement.setActive(true)
        }

        if (this.count >= this.getMaxGeodes()) {
            this.buttons.increment.setActive(false)
            this.buttons.bigIncrement.setActive(false)
        } else {
            this.buttons.increment.setActive(true)
            this.buttons.bigIncrement.setActive(true)
        }

        if (this.count <= 0) {
            this.geodeAmount.setColor(sc.GUI_NUMBER_COLOR.GREY)
            this.costNumber.setColor(sc.GUI_NUMBER_COLOR.GREY)
        } else {
            this.geodeAmount.setColor(sc.GUI_NUMBER_COLOR.WHITE)
            this.costNumber.setColor(sc.GUI_NUMBER_COLOR.RED)
        }

        this.geodeAmount.setNumber(this.count, true)
        this.costNumber.setNumber(this.count * -this.pricePerGeode, true)
        this.openGeodesButton.setText(ig.lang.get(this.count !== 1 ? "sc.gui.geode.openGeodesPlural" : "sc.gui.geode.openGeodesSingular").replace("[!]", this.count.toString()))
        if (this.count === 0) this.openGeodesButton.setActive(false)
    },

    openGeodes() {
        sc.model.player.removeCredit(this.count * this.pricePerGeode);
        let itemsGiven: el.GeodeOpeningGui.ItemAmounts = {}
        let chance = 1, itemsObtained = 1, roll = 0;
        sc.model.player.removeItem("el-item-geode", this.count);

        function addItem(itemID: sc.ItemID, isRare?: boolean, orderMult?: number) {
            if (itemsGiven[itemID]) itemsGiven[itemID].amount++;
            else itemsGiven[itemID] = {
                amount: 1,
                isRare
            }
        }

        let crystals = 0;

        do {
            chance = 1;
            itemsObtained = 1;

            while (chance >= (roll = Math.random())) {
                let adjustedChance = roll * this.totalWeight;
                for (const entry of this.rewardTable) {
                    if (entry.summedWeight >= adjustedChance) {
                        let item = entry.items.random();
                        addItem(item, false, entry.order);
                        break;
                    }
                }

                itemsObtained++;
                chance /= itemsObtained
                chance *= 1.25
            }

            crystals += 40 + Math.random() * 25
            // basically, if you don't get many gems/items, you'll get a little more crystals on average instead.
            crystals += Math.random() * 40 * chance
            crystals = Math.floor(crystals)
        } while (--this.count > 0)

        this.rewardGui.setListItems(itemsGiven, crystals);
        ig.gui.addGuiElement(this.rewardGui);
        this.rewardGui.show();
        this.count = 1;
        // force it to update to the correct values
        this._updateCounters();
    },

    modelChanged() { },

    generateRewardTable() {
        this.rewardTable = [];
        let allRewards = ig.database.get("el-geodeRewards");

        let runningWeight = 0;
        for (const entry of allRewards) {
            runningWeight += entry.weight;
            this.rewardTable.push({
                items: entry.items,
                summedWeight: runningWeight,
                order: entry.order
            })
        }
        this.totalWeight = runningWeight;
    }
})

//@ts-ignore
sc.modUtils.registerMenu("GEODE_OPENING", el.GeodeOpeningGui, "geodeOpening")

// inspired mostly by sc.ShopConfirmDialog
el.GeodeRewardsGui = sc.ModalButtonInteract.extend({
    transitions: {
        DEFAULT: {
            state: {
                alpha: 1
            },
            time: 0.2,
            timeFunction: KEY_SPLINES.EASE_OUT
        },
        HIDDEN: {
            state: {
                alpha: 0,
            },
            time: 0.4,
            timeFunction: KEY_SPLINES.EASE_IN
        }
    },
    ninepatch: new ig.NinePatch("media/gui/menu.png", {
        width: 16,
        height: 9,
        left: 4,
        top: 4,
        right: 4,
        bottom: 4,
        offsets: {
            "default": {
                x: 512,
                y: 457
            }
        }
    }),
    sounds: {
        getRareItem: new ig.Sound("media/sound/drops/drop-rare-silver.ogg", 1)
    },

    list: null,
    listContent: null,

    listItems: {},
    listEntries: [],
    done: false,
    timer: 0,
    currentIndex: 0,
    listitemYOffset: 0,
    crystals: 0,

    init(items, crystals) {
        this.parent(
            ig.lang.get("sc.gui.geode.rewardTitle"),
            null,
            [ig.lang.get("sc.gui.geode.close")],
            this.onDialogCallback.bind(this)
        )

        this.msgBox.centerBox.hook.localAlpha = 1;
        this.textGui.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);

        let contentHookSize = this.content.hook.size.y,
            textHookSize = this.textGui.hook.size.y + 1;

        this.listContent = new ig.GuiElementBase;
        this.list = new sc.ScrollPane(sc.ScrollType.Y_ONLY);
        this.list.setContent(this.listContent);
        this.list.setSize(190, 121);
        this.list.setPos(0, textHookSize);

        this.content.addChildGui(this.list);
        this.content.setSize(190, 121 + contentHookSize);
        this.msgBox.setPos(0, -12);
        this.msgBox.resize();

        this.listItems = items ?? {};
        this.crystals = crystals ?? 0;
    },

    update: function () {
        //@ts-ignore
        this.parent();
        if (!this.done) {
            if (this.timer <= 0) {
                if (this.currentIndex >= this.listEntries.length) {
                    this.done = true;
                    return;
                }
                this.timer = 0.15;
                let currentEntry = this.listEntries[this.currentIndex]
                let guiItem = new el.GeodeRewardEntry(currentEntry[0], currentEntry[1].amount, false);
                guiItem.setPos(0, this.listContent.hook.size.y)
                this.listContent.hook.size.y += guiItem.hook.size.y;
                this.listContent.addChildGui(guiItem);

                if (currentEntry[1].isRare) this.sounds.getRareItem.play()
                guiItem.doStateTransition("HIDDEN", true);
                guiItem.doStateTransition("DEFAULT")

                this.list.recalculateScrollBars(true);
                this.list.setScrollY(this.listContent.hook.size.y, false, 0.15, KEY_SPLINES.LINEAR);

                this.currentIndex++;
            } else {
                this.timer -= ig.system.tick;
            }
        } else {
            this.buttonInteract.isActive() && this.buttongroup.isActive() && (sc.control.menuScrollUp() ? this.list.scrollY(-8) : sc.control.menuScrollDown() && this.list.scrollY(8))
        }
    },

    createList() {
        this.listContent.removeAllChildren();
        //@ts-ignore
        this.list.box.doScrollTransition(0, 0, 0);
        this.list.recalculateScrollBars();

        let guiItem = new el.GeodeRewardEntry(`\\i[el-gem-credits]${ig.lang.get("sc.gui.shop.crystals")}`, this.crystals, true)
        guiItem.setPos(0, 0);
        this.listContent.hook.size.y = guiItem.hook.size.y;
        this.listContent.addChildGui(guiItem);

        if (this.listItems) {
            this.listEntries = Object.entries(this.listItems).sort((element1, element2) => {
                let item1 = sc.inventory.getItem(element1[0])!,
                    item2 = sc.inventory.getItem(element2[0])!;
                function getMult(item: sc.Inventory.Item): number {
                    switch (item.type) {
                        case sc.ITEMS_TYPES.TRADE: return 1;
                        case sc.ITEMS_TYPES.CONS: return 1e3;
                        case sc.ITEMS_TYPES.EQUIP: return 1e6;
                        case sc.ITEMS_TYPES.KEY: return 1e9;
                        case sc.ITEMS_TYPES.TOGGLE: return 1e12;
                        default: return 1e15;
                    }
                }
                return item1.order * getMult(item1) - item2.order * getMult(item2)
            }).map(element => {
                let item = sc.inventory.getItem(element[0])!;
                element[0] = `\\i[${item.icon + sc.inventory.getRaritySuffix(item.rarity || 0) || "item-default"}]${ig.LangLabel.getText(item.name)}`;
                return element
            })
            this.timer = 0.2;
            this.done = false;
            this.currentIndex = 0;
        }
        this.list.recalculateScrollBars(true)
    },

    setListItems(items, crystals) {
        this.listItems = items ?? {};
        this.crystals = crystals ?? 0;
    },

    onDialogCallback() {
        for (let [item, data] of Object.entries(this.listItems)) {
            sc.model.player.addItem(item, data.amount, true)
        }
        sc.modUtils.currencies["crystals"].add(this.crystals)
        this.hide();
    },

    show() {
        this.createList();
        //@ts-ignore
        this.parent();
    }
})

el.GeodeRewardEntry = ig.GuiElementBase.extend({
    gfx: new ig.Image("media/gui/menu.png"),
    item: null,
    amount: null,
    isGems: false,
    transitions: {
        DEFAULT: {
            state: {},
            time: 0.2,
            timeFunction: KEY_SPLINES.LINEAR
        },
        HIDDEN: {
            state: {
                alpha: 0
            },
            time: 0.2,
            timeFunction: KEY_SPLINES.LINEAR
        }
    },
    init: function (itemName, amount, isGems) {
        this.parent();
        this.isGems = isGems || false;

        this.setSize(190, 17);
        this.item = new sc.TextGui(itemName);
        this.item.setPos(0, 0);
        this.addChildGui(this.item);
        this.amount = new sc.NumberGui(isGems ? 99999 : 99, {
            size: sc.NUMBER_SIZE.TEXT
        });
        this.amount.setPos(145 + (this.isGems ? 0 : 24), 4);
        this.amount.setNumber(amount, true);
        this.addChildGui(this.amount);
    },
    updateDrawables: function (b) {
        b.addGfx(this.gfx, 132 + (this.isGems ? 0 : 24), 6, 560, 416, 8, 8);
    }
})
//#endregion Geode GUI