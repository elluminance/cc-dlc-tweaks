export default function () {
    // i honestly couldn't be bothered to do types for all of this :leaCheese:

    //@ts-ignore
    sc.MENU_SHOP_TYPES.CRYSTAL = "CRYSTAL"

    sc.PlayerModel.inject({
        getCrystalCoins() {
            let value: number;
            if (!(value = ig.vars.get("dlctweaks.crystals") ?? 0))
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

    sc.ShopConfirmDialog.inject({
        createList() {
            this.parent();

            if (sc.menu.shopGemCoinMode) {
                this.buttons[0].submitSound = sc.BUTTON_SOUND.shop_cash;
                this.notifyRaritySell = false;
            }
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
            if (sc.menu.shopGemCoinMode) this.hideSymbol || b.addGfx(this.gemGfx, this.hook.size.x - 15, -2, 11, 0, 12, 12)
            else this.parent(b)
        }
    })

    sc.ShopMenu.inject({
        buyItems() {
            if (sc.menu.shopGemCoinMode) {
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
            if (sc.menu.shopGemCoinMode) {
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
            if (sc.menu.shopGemCoinMode) {
                var a = (b as unknown as number) || 0;
                if (b == undefined) {
                    for (let cart = sc.menu.shopCart, d = cart.length; d--;) a = a + cart[d].price * cart[d].amount;
                    this.value.setNumber(-a)
                }
                let value = 0;
                if (sc.menu.shopSellMode) {
                    value = sc.model.player.getCrystalCoins() + a;
                    this.value.number.setColor(sc.GUI_NUMBER_COLOR.GREEN);
                    this.value.setNumber(a)
                } else {
                    value = sc.model.player.getCrystalCoins() - a;
                    this.value.number.setColor(sc.GUI_NUMBER_COLOR.RED);
                    this.value.setNumber(-a)
                }
                this.rest.setNumber(value);
                this.value.number.showPlus = sc.menu.shopSellMode && !!a;
                if (value < 0) {
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
        "dlctweaks-trade-final-dng-gem"
    ]

    const otherGems = [
        "dlctweaks-trade-warm-gem",
        "dlctweaks-trade-cool-gem",
    ]

    sc.ShopListMenu.inject({
        createBuyList(b, a, d, sortType) {
            if (sc.menu.shopGemCoinMode) {
                b = b || false;
                a = a || false;
                d = d || false;
                this._prevSortType = sortType = sortType || sc.SORT_TYPE.ORDER;
                this.buttongroup.clear();
                this.list.clear(b);
                let buyItems: ig.Database.ShopItem[] = [],
                    sellItems: sc.ItemID[] = [];
                if (sc.menu.shopSellMode) {
                    sellItems = [];
                    [...sc.BOOSTER_GEMS, ...otherGems].forEach(element => {
                        if (sc.model.player.getItemAmount(element) >= 1) sellItems.push(element)
                    })
                } else {
                    buyItems = ig.copy(ig.database.get("shops")[sc.menu.shopID!].pages[sc.menu.shopPage].content);
                    sc.ShopHelper.sortList(buyItems, sortType)
                }
                sc.menu.shopSellMode ? this.scrapSellList(sellItems) : this.scrapBuyList(buyItems);
                if (b) {
                    a ? this.buttongroup.setCurrentFocus(0, 0) : this.buttongroup.focusCurrentButton(0, 0, false, d);
                    this.list.list.scrollToY(0, true)
                }
                this.getRepeaterValue()
            } else this.parent(b, a, d, sortType)
        },

        scrapBuyList(b) {
            if (sc.menu.shopGemCoinMode) {
                let maxVal: number,
                    itemID: sc.ItemID,
                    itemAmount: number,
                    item: sc.Inventory.Item,
                    maxOwn = ig.database.get("shops")[sc.menu.shopID!].maxOwn || 99,
                    itemEquipLevel: number,
                    moneyLeft = sc.model.player.getCrystalCoins() - sc.menu.getTotalCost(),
                    itemCost: number,
                    itemQuantity: number,
                    itemName: string,
                    itemDesc: string,
                    button: sc.ShopItemButton;

                for (var c = 0, k = 0; k < b.length; k++)
                    if (!b[k].condition || (new ig.VarCondition(b[k].condition)).evaluate()) {
                        itemID = b[k].item;
                        item = sc.inventory.getItem(itemID)!;
                        itemAmount = sc.model.player.getItemAmountWithEquip(itemID);
                        itemEquipLevel = 0;
                        item.type == sc.ITEMS_TYPES.EQUIP && (itemEquipLevel = item.level || 1);

                        itemCost = b[k].price || item.cost;
                        itemQuantity = sc.menu.getItemQuantity(itemID, itemCost);
                        itemName = "\\i[" + (item.icon + sc.inventory.getRaritySuffix(item.rarity || 0) || "item-default") + "]" + ig.LangLabel.getText(item.name);
                        itemDesc = ig.LangLabel.getText(item.description);
                        button = new sc.ShopItemButton(itemName, itemID, itemDesc, itemAmount, itemCost, itemEquipLevel);
                        itemQuantity >= 0 && button.setCountNumber(itemQuantity, true);
                        if ((b[k].maxOwn || ig.database.get("shops")[sc.menu.shopID!].maxOwn) != undefined) {
                            c = sc.stats.getMap("items", itemID.toString())
                            maxVal = button.data.maxOwn = b[k].maxOwn!;
                        } else maxVal = 99;
                        (moneyLeft < itemCost && !sc.menu.getItemQuantity(itemID, itemCost) || c >= Math.min(maxVal, maxOwn)) && button.setActive(false);
                        this.list.addButton(button)
                    }
            } else this.parent(b)
        },

        updateListEntries(b) {
            if (sc.menu.shopGemCoinMode) {
                let player = sc.model.player,
                    coins = sc.model.player.getCrystalCoins() - sc.menu.getTotalCost();
                for (let c = this.list.getChildren(),
                    e = c.length, maxOwn = ig.database.get("shops")[sc.menu.shopID!].maxOwn || 99;
                    e--;
                ) {
                    //@ts-ignore
                    var g = c[e].gui;
                    if (!sc.menu.shopSellMode) {
                        var h = sc.menu.getItemQuantity(g.data.id, g.price);
                        ((player.getItemAmountWithEquip(g.data.id)) >= (g.data.maxOwn || maxOwn))
                            ? g.setActive(false)
                            : !h && g.price > coins
                                ? g.setActive(false)
                                : g.setActive(true)
                    }
                    if (b) {
                        g.setCountNumber(0, true);
                    }
                    g.owned.setNumber(sc.menu.shopSellMode ? player.getItemAmount(g.data.id) : player.getItemAmountWithEquip(g.data.id))
                }
            } else this.parent(b)
        },

        changeCount(changeValue) {
            if (sc.menu.shopGemCoinMode) {
                var a = this.getActiveElement();
                if (a && a.active && a.data && a.data.id) {
                    var buyableItems = a.data.maxOwn || ig.database.get("shops")[sc.menu.shopID!].maxOwn || 99,
                        c = a.data.id,
                        e = a.price,
                        itemsInCart = sc.menu.getItemQuantity(c, e),
                        buyableItems = sc.ShopHelper.getMaxBuyable(c, itemsInCart, e, buyableItems);
                    if (!(itemsInCart == 0 && changeValue == -1) && !(itemsInCart == buyableItems && changeValue == 1)) {
                        changeValue = Math.min(changeValue, buyableItems) as -1 | 1
                        this.playSound(changeValue, true);
                        sc.menu.updateCart(c, itemsInCart + changeValue, e);
                        a.setCountNumber(itemsInCart + changeValue, itemsInCart == 0);
                        this.updateListEntries()

                    }
                }
            } else this.parent(changeValue)
        }
    })

    sc.ShopPageCounter.inject({
        show() {
            this.parent();

            if (sc.menu.shopGemCoinMode && sc.menu.shopSellMode) {
                this.pageText.setText(ig.lang.get("sc.gui.shop.sellPages.gems"))
                this.cycleLeft.setActive(false);
                this.cycleRight.setActive(false);
                this.cycleLeft.setText("\\i[arrow-left-off]");
                this.cycleRight.setText("\\i[arrow-right-off]")
            }
        }
    })

    sc.ShopItemButton.inject({
        maxOwn: 99,
        init(itemName, itemID, itemDescription, itemAmount, cost, itemEquipLevel) {
            if (sc.menu.shopGemCoinMode && sc.menu.shopSellMode) {
                cost = Math.max((cost / 10).floor(), 0)
            }
            this.parent(itemName, itemID, itemDescription, itemAmount, cost, itemEquipLevel)
        }
    })

    sc.ShopQuantitySelect.inject({
        show(a, b, c) {
            this.parent(a, b, c);

            if (!this.active) return;
            let price = this._button.price
            let quantity = sc.menu.getItemQuantity(this._button.data.id, price)

            let d = price * quantity,
                e = this._button.data.maxOwn || ig.database.get("shops")[sc.menu.shopID!].maxOwn || 99;
            if (sc.menu.shopGemCoinMode && !sc.menu.shopSellMode) {
                var k = sc.model.player.getCrystalCoins();
                this._max = Math.min(e || 99, (e || 99) - sc.model.player.getItemAmount(a.data.id));
                this._max = Math.min(this._max, Math.floor(Math.max(0, k - sc.menu.getTotalCost() + d) / price))
            }
        }
    })


    // since injections don't work in this case, we'll just have to make do :P

    let getMaxBuyableOriginal = sc.ShopHelper.getMaxBuyable;

    sc.ShopHelper.getMaxBuyable = function (itemID, a, d, c) {
        if (sc.menu.shopGemCoinMode && !sc.menu.shopSellMode) {
            a = a * d;
            let coins = sc.model.player.getCrystalCoins(),
                b = Math.min(c || 99, (c || 99) - sc.model.player.getItemAmount(itemID));
            return Math.min(b, Math.floor(Math.max(0, coins - sc.menu.getTotalCost() + a) / d))
            //@ts-expect-error
        } else return getMaxBuyableOriginal(itemID, a, d, c)
    }
}