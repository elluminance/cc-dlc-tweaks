// i honestly couldn't be bothered to do types for all of this :leaCheese:

sc.MENU_SUBMENU.EL_CRYSTAL = "CRYSTAL_SHOP"
sc.MENU_SHOP_TYPES.CRYSTAL = "CRYSTAL"


sc.PlayerModel.inject({
    getCrystalCoins(){
        let value;
        if(!(value = ig.vars.get("dlctweaks.crystals"))) 
            ig.vars.set("dlctweaks.crystals", (value = 0))
        return value
    },

    setCrystalCoins(value) {
        ig.vars.set("dlctweaks.crystals", value)
    },

    addCrystalCoins(value) {
        ig.vars.add("dlctweaks.crystals", value)
    }
})

sc.MenuModel.inject({
    shopGemCoinMode: false,

    exitMenu() {
        this.parent()
        this.shopGemCoinMode = false;
    }
})

ig.EVENT_STEP.OPEN_SHOP.inject({
    start() {
        let shop = ig.database.get("shops")[this.shop]
        if (sc.MENU_SHOP_TYPES[shop.shopType] == sc.MENU_SHOP_TYPES.CRYSTAL) {
            sc.menu.shopGemCoinMode = true            
        }
        this.parent()
    }
})

sc.ShopConfirmEntry.inject({
    gemGfx: new ig.Image("media/gui/el-mod-gui.png"), 
    updateDrawables(b) {
        if (sc.menu.shopGemCoinMode) {
            b.addGfx(this.gfx, 132, 6, 560, 416, 8, 8);
            b.addGfx(this.gfx, 164, 7, 568, 416, 8, 8);

            b.addGfx(this.gemGfx, 232, 4, 11, 0, 12, 12)
        } else this.parent(b)
    }
})

sc.ShopCartEntry.inject({
    gemGfx: new ig.Image("media/gui/el-mod-gui.png"), 

    updateDrawables(b) {
        if(sc.menu.shopGemCoinMode) this.hideSymbol || b.addGfx(this.gemGfx, this.hook.size.x - 15, -2, 11, 0, 12, 12)
        else this.parent(b)
    }
})

sc.ShopMenu.inject({
    buyItems() {
        if(sc.menu.shopGemCoinMode) {
            sc.model.player.addCrystalCoins(-sc.menu.getTotalCost())

            let value = 0;
            sc.menu.shopCart.forEach(element => {
                value += element.amount;
                sc.model.player.addItem(element.id, element.amount, true)
            })
            sc.stats.addMap("items", "buy", value)
            return false
        } else return this.parent()
    },

    sellItems() {
        if(sc.menu.shopGemCoinMode) {
            sc.model.player.addCrystalCoins(sc.menu.getTotalCost());
            let c = false, value = 0;
            sc.menu.shopCart.forEach(element => {
                value += element.amount
                sc.model.player.removeItem(element.id, element.amount);
                sc.model.player.getItemAmount(element.id) <= 0 && !c && (c = true)
            })
            sc.stats.addMap("items", "sell", value);

            return c
        } else return this.parent()
    },
})

sc.ShopCart.inject({
    init() {
        this.parent();
        if (sc.menu.shopGemCoinMode) this.credits.text.setText(`${ig.lang.get("sc.gui.shop.crystals")}:`)
    },
    resetNumbers(b) {
        if (sc.menu.shopGemCoinMode) {
            let a = sc.model.player.getCrystalCoins()
            this.credits.setNumber(a, b);
            this.value.setNumber(0, b);
            this.rest.setNumber(a, b);
            a < 0 ? this.rest.number.setColor(sc.GUI_NUMBER_COLOR.RED) : this.rest.number.setColor(sc.GUI_NUMBER_COLOR.WHITE);
            this.checkout.setActive(false)
        } else this.parent(b)
    },

    updateValue(b) {
        if(sc.menu.shopGemCoinMode){
            var a = b || 0;
            if (b == undefined) {
                for (var b = sc.menu.shopCart, d = b.length; d--;) a = a + b[d].price * b[d].amount;
                this.value.setNumber(-a)
            }
            b = 0;
            if (sc.menu.shopSellMode) {
                b = sc.model.player.getCrystalCoins() + a;
                this.value.number.setColor(sc.GUI_NUMBER_COLOR.GREEN);
                this.value.setNumber(a)
            } else {
                b = sc.model.player.getCrystalCoins() - a;
                this.value.number.setColor(sc.GUI_NUMBER_COLOR.RED);
                this.value.setNumber(-a)
            }
            this.rest.setNumber(b);
            this.value.number.showPlus = sc.menu.shopSellMode && a;
            if (b < 0) {
                this.rest.number.setColor(sc.GUI_NUMBER_COLOR.RED);
                this.checkout.setActive(false)
            } else {
                sc.menu.shopCart.length == 0 ? this.checkout.setActive(false) : this.enabled && this.checkout.setActive(true);
                this.rest.number.setColor(sc.GUI_NUMBER_COLOR.WHITE)
            }
        } else this.parent(b)
    }
})

sc.BOOSTER_GEMS = [
    457,
    458,
    459,
    460,
    461,
    462,
    463,
    464,
    465,
    "dlctweaks-trade-beach-gem",
    "dlctweaks-trade-final-dng-gem",
    "dlctweaks-trade-warm-gem",
    "dlctweaks-trade-cool-gem",
]

sc.ShopListMenu.inject({
    createBuyList(b, a, d, c) {
        if(sc.menu.shopGemCoinMode){
            b = b || false;
            a = a || false;
            d = d || false;
            this._prevSortType = c = c || sc.SORT_TYPE.ORDER;
            this.buttongroup.clear();
            this.list.clear(b);
            var e = null,
                e = null;
            if (sc.menu.shopSellMode) {
                e = sc.SELL_PAGES[sc.menu.shopPage];
                e = sc.BOOSTER_GEMS
            } else {
                e = ig.database.get("shops")[sc.menu.shopID].pages;
                e = ig.copy(e[sc.menu.shopPage].content);
                sc.ShopHelper.sortList(e, c)
            }
            sc.menu.shopSellMode ? this.scrapSellList(e) : this.scrapBuyList(e);
            if (b) {
                a ? this.buttongroup.setCurrentFocus(0, 0) : this.buttongroup.focusCurrentButton(0, 0, false, d);
                this.list.list.scrollToY(0, true)
            }
            this.getRepeaterValue()
        } else this.parent(b, a, d, c)
    },

    scrapSellList(b) {
        this.parent(b)
    },

    updateListEntries(b) {
        if(sc.menu.shopGemCoinMode) {
            for (var a = sc.model.player, 
                d = sc.model.player.getCrystalCoins(), 
                c = sc.menu.getTotalCost(), 
                d = d - c, c = this.list.getChildren(),
                e = c.length, f = ig.database.get("shops")[sc.menu.shopID].maxOwn || 99; 
                e--;) 
            {
                var g = c[e].gui;
                if (!sc.menu.shopSellMode) {
                    var h = sc.menu.getItemQuantity(g.data.id, g.price);
                    a.getItemAmountWithEquip(g.data.id) >= f ? g.setActive(false) : !h && g.price > d ? g.setActive(false) : g.setActive(true)
                }
                if (b) {
                    g.setCountNumber(0, true);
                    g.owned.setNumber(sc.menu.shopSellMode ? a.getItemAmount(g.data.id) : a.getItemAmountWithEquip(g.data.id))
                }
            }
        } else this.parent(b)
    }
})

sc.ShopPageCounter.inject({
    show() {
        this.parent();

        if(sc.menu.shopGemCoinMode && sc.menu.shopSellMode) {
            this.pageText.setText(ig.lang.get("sc.gui.shop.sellPages.gems"))
            this.cycleLeft.setActive(false);
            this.cycleRight.setActive(false);
            this.cycleLeft.setText("\\i[arrow-left-off]");
            this.cycleRight.setText("\\i[arrow-right-off]")
        }
    }
})

sc.ShopItemButton.inject({
    init(itemName, itemID, itemDescription, itemAmount, cost, itemEquipLevel) {
        if(sc.menu.shopGemCoinMode && sc.menu.shopSellMode) {
            cost = (cost / 15).floor().limit(0, Infinity);
        }
        this.parent(itemName, itemID, itemDescription, itemAmount, cost, itemEquipLevel)
    }
})