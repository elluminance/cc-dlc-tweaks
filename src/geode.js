//@ts-ignore
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
        if(a.event?.geode) {
            let c = {
                name: "NPC EVENT",
                steps: a.event.geode
            }

            this.npcEventObj = new ig.Event(c)
            this.npcEventType = sc.NPC_EVENT_TYPE.GEODE
        }
    }
})

// a lot similar to sc.ShopConfirmDialog, but not the same
sc.GeodeRewardsGui = sc.ModalButtonInteract.extend({
    transitions: {
        DEFAULT: {
            state: {},
            time: 0.2,
            timeFunction: KEY_SPLINES.LINEAR
        },
        HIDDEN: {
            state: {
                alpha: 0,
                scaleX: 0
            },
            time: 0.2,
            timeFunction: KEY_SPLINES.LINEAR
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
            ig.lang.get("sc.gui.geode.title"), 
            null, 
            [ig.lang.get("sc.gui.geode.okay")],
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

        this.listItems = items;
        this.crystals = crystals ?? 0;
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
        
        for(let [itemID, count] of Object.entries(this.listItems)) {
            item = sc.inventory.getItem(itemID);
            itemName = `\\i[${item.icon + sc.inventory.getRaritySuffix(item.rarity || 0) || "item-default"}]${ig.LangLabel.getText(item.name)}`;

            guiItem = new sc.GeodeRewardEntry(itemName, count, false)
            guiItem.setPos(0, offset)
            offset += guiItem.hook.size.y

            this.listContent.addChildGui(guiItem);
        }

        this.listContent.hook.size.y = offset;
        this.list.recalculateScrollBars(true)
    },

    onDialogCallback(b) {
        console.log(b)
    }
})

sc.GeodeRewardEntry = ig.GuiElementBase.extend({
    gfx: new ig.Image("media/gui/menu.png"),
    item: null,
    amount: null,
    isGems: false,

    init: function(itemName, amount, isGems) {
        this.parent();
        this.isGems = isGems ?? false;

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