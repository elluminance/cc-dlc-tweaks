//#region NPC
sc.NPC_EVENT_TYPE.GEODE = "GEODE"

if(!sc.MAP_INTERACT_ICONS) sc.MAP_INTERACT_ICONS = {}

sc.MAP_INTERACT_ICONS.GEODE = new sc.MapInteractIcon(
    new ig.TileSheet("media/gui/el-mod-map-icons.png", 24, 24, 0, 0), 
    {FOCUS: [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0], NEAR: [4], AWAY: [5]},
    0.05
)

ig.ENTITY.NPC.inject({
    init(a, b, c, d) {
        this.parent(a, b, c, d);
    },

    setMapInteractIcon(a) {
        this.parent(a)
        if (a.npcEventType == sc.NPC_EVENT_TYPE.GEODE) {
            this.interactEntry.setIcon(sc.MAP_INTERACT_ICONS.GEODE);
        }
    }
})

sc.NpcState.inject({
    init(a, b) {
        this.parent(a, b)
        if(a.event && a.event.geode) {
            let c = {
                name: "NPC EVENT",
                steps: a.event.geode
            }

            this.npcEventObj = new ig.Event(c)
            this.npcEventType = sc.NPC_EVENT_TYPE.GEODE
        }
    }
})

ig.EVENT_STEP.OPEN_GEODE_MENU = ig.EventStepBase.extend({
    init() {},

    start() {
        sc.menu.setDirectMode(true, sc.MENU_SUBMENU.GEODE_OPENING);
        sc.model.enterMenu(true);
        sc.model.prevSubState = sc.GAME_MODEL_SUBSTATE.RUNNING
    }
})
//#endregion NPC



//#region Geode GUI
sc.GeodeOpeningGui = sc.BaseMenu.extend({
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
    buttons: {
        increment: null,
        decrement: null,
        bigDecrement: null,
        bigIncrement: null,
    },
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
        
        this.count = 0;
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
        this.buttongroup.addPressCallback(function(a) {
            a.data != void 0 && this.onButtonCallback(a, this)
        }.bind(this));
        
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
        this.openGeodesButton.submitSound = sc.BUTTON_SOUND.shop_cash
        this.buttongroup.addFocusGui(this.openGeodesButton, 0, 1)
        this.content.addChildGui(this.openGeodesButton)

        this.msgBox = new sc.CenterBoxGui(this.content);
        this.msgBox.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_CENTER);

        this.rewardGui = new sc.GeodeRewardsGui;
        this.rewardGui.doStateTransition("HIDDEN", true);
        this.msgBox.hook.zIndex + 1000
        this.addChildGui(this.rewardGui);

        this.addChildGui(this.msgBox);
        this.doStateTransition("HIDDEN", true)
        this.incrementValue(1)
    },

    addObservers: function() {
        sc.Model.addObserver(sc.menu, this)
    },
    
    removeObservers: function() {
        sc.Model.removeObserver(sc.menu, this)
    },

    showMenu: function() {
        this.addObservers();
        sc.menu.buttonInteract.pushButtonGroup(this.buttongroup);
        sc.menu.pushBackCallback(this.onBackButtonPress.bind(this));
        sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.HIDDEN);
        sc.model.addChoiceGui(this)
        ig.interact.setBlockDelay(0.2);
        this.doStateTransition("DEFAULT")
        this.msgBox.doStateTransition("DEFAULT")
    },
    
    hideMenu: function() {
        this.removeObservers();
        ig.interact.removeEntry(this.buttonInteract);
        sc.model.removeChoiceGui(this)
        sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.LARGE);
        this.doStateTransition("HIDDEN")
        this.msgBox.doStateTransition("HIDDEN")
    },

    onButtonCallback(button) {
        switch(button.data.type) {
            case "changeValue": 
                this.incrementValue(button.data.value)
                break;
            case "openGeodes":
                this.openGeodes();
                break;
        }
    },

    onBackButtonPress: function() {
        sc.menu.popBackCallback();
        sc.menu.popMenu()
    },

    getMaxGeodes() {
        return Math.min(Math.floor(sc.model.player.credit / this.pricePerGeode), sc.model.player.getItemAmount("el-item-geode"));
    },

    incrementValue(change) {
        this.count = (this.count + change).limit(1, this.getMaxGeodes())
        this._updateCounters()
    },

    _updateCounters() {
        if(this.count <= 1) {
            this.buttons.decrement.setActive(false)
            this.buttons.bigDecrement.setActive(false)
        } else {
            this.buttons.decrement.setActive(true)
            this.buttons.bigDecrement.setActive(true)
        }

        if(this.count >= this.getMaxGeodes()) {
            this.buttons.increment.setActive(false)
            this.buttons.bigIncrement.setActive(false)
        } else {
            this.buttons.increment.setActive(true)
            this.buttons.bigIncrement.setActive(true)
        }

        this.geodeAmount.setNumber(this.count, true)
        this.costNumber.setNumber(this.count * -this.pricePerGeode, true)
        this.openGeodesButton.setText(ig.lang.get(this.count !== 1 ? "sc.gui.geode.openGeodesPlural" : "sc.gui.geode.openGeodesSingular").replace("[!]", this.count))
        if(this.count == 0) this.openGeodesButton.setActive(false)
    },

    openGeodes() {
        sc.model.player.removeCredit(this.count * this.pricePerGeode);
        let itemsGiven = {}
        let chance = 1, gemsGotten = 1;
        sc.model.player.removeItem("el-item-geode", this.count);

        let crystals = 0;

        do {
            chance = 1;
            gemsGotten = 1;

            while(chance >= Math.random()) {
                let gem = sc.BOOSTER_GEMS.random()
                if (itemsGiven[gem]) itemsGiven[gem]++
                else itemsGiven[gem] = 1

                gemsGotten++;
                chance /= gemsGotten
                chance *= 1.25
            }

            crystals += 60 + Math.random() * 40 
            // basically, if you don't get many gems, you'll get slightly more crystals on average instead.
            crystals += Math.random() * 30 * (1 - chance)
            crystals = Math.floor(crystals)
        } while(--this.count > 0)

        this.rewardGui.setListItems(itemsGiven, crystals);
        ig.gui.addGuiElement(this.rewardGui)
        this.rewardGui.show();
        this.count = 1;
        // force it to update to the correct values
        this.incrementValue(0);
    },

    modelChanged: function() {}
})

sc.MENU_SUBMENU.GEODE_OPENING = "GEODE_OPENING"

sc.SUB_MENU_INFO[sc.MENU_SUBMENU.GEODE_OPENING] = {
    Clazz: sc.GeodeOpeningGui,
    name: "geodeOpening"
}

// inspired mostly by sc.ShopConfirmDialog
sc.GeodeRewardsGui = sc.ModalButtonInteract.extend({
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

    list: null,
    listContent: null,

    listItems: {},
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

        var contentHookSize = this.content.hook.size.y,
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

        this.listItems = items || {};
        this.crystals = crystals || 0;
    },

    update: function() {
        this.parent();
        this.buttonInteract.isActive() && this.buttongroup.isActive() && (sc.control.menuScrollUp() ? this.list.scrollY(-17) : sc.control.menuScrollDown() && this.list.scrollY(17))
    },

    createList() {
        this.listContent.removeAllChildren();
        this.list.box.doScrollTransition(0, 0, 0);
        this.list.recalculateScrollBars();

        let item, guiItem, offset = 0, itemName;

        guiItem = new sc.GeodeRewardEntry(`\\i[el-gem-credits]${ig.lang.get("sc.gui.shop.crystals")}`, this.crystals, true)
        guiItem.setPos(0, offset);
        offset += guiItem.hook.size.y;
        this.listContent.addChildGui(guiItem);

        if(this.listItems) {
            for(let [itemID, count] of Object.entries(this.listItems)) {
                item = sc.inventory.getItem(itemID);
                itemName = `\\i[${item.icon + sc.inventory.getRaritySuffix(item.rarity || 0) || "item-default"}]${ig.LangLabel.getText(item.name)}`;

                guiItem = new sc.GeodeRewardEntry(itemName, count, false)
                guiItem.setPos(0, offset)
                offset += guiItem.hook.size.y

                this.listContent.addChildGui(guiItem);
            }
        }

        this.listContent.hook.size.y = offset;
        this.list.recalculateScrollBars(true)
    },

    setListItems(items, crystals) {
        this.listItems = items || {};
        this.crystals = crystals || 0;
    },

    onDialogCallback() {
        for(let [item, count] of Object.entries(this.listItems)){ 
            sc.model.player.addItem(item, count, true)
        }
        sc.model.player.addCrystalCoins(this.crystals)
        this.hide();
    },

    show() {
        this.createList();
        this.parent();
    }
})

sc.GeodeRewardEntry = ig.GuiElementBase.extend({
    gfx: new ig.Image("media/gui/menu.png"),
    item: null,
    amount: null,
    isGems: false,

    init: function(itemName, amount, isGems) {
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
    updateDrawables: function(b) {
        this.parent(b);
        b.addGfx(this.gfx, 132 + (this.isGems ? 0 : 24), 6, 560, 416, 8, 8);
    }
})
//#endregion Geode GUI