sc.QuickItemMenu.inject({
    updateList(skipSounds) {
        if(el.gauntlet.active) {
            
            let scrollY = this.list.getScrollY();
            let currentY = this.buttongroup.current.y;

            if(!sc.options.get("quick-cursor")) scrollY = currentY = 0;

            this.buttongroup.clear();
            this.list.clear(true);

            let itemList = el.gauntlet.getItems();
            for(let [id, count] of itemList) {
                let item = sc.inventory.getItem(id)!;
                let name = `\\i[${(item.icon + sc.inventory.getRaritySuffix(item.rarity)) || "item-default"}]${ig.LangLabel.getText(item.name)}`;
                let desc = ig.LangLabel.getText(item.description);
                let button = new sc.ItemBoxButton(name, 142, 26, count, id, desc);

                if(sc.model.player.isFavorite(id)) this.addFavoriteOverlay(button);

                this.list.addButton(button);
            }
        } else this.parent(skipSounds);
    }
})