ig.EVENT_STEP.OPEN_GEODES = ig.EventStepBase.extend({
    init(settings) {
        this.count = settings.count ?? "all"
    },

    start() {
        let geodesLeft: number;
        if(this.count === "all") {
            geodesLeft = sc.model.player.getItemAmount("el-item-geode")
        } else {
            geodesLeft = Math.min(this.count, sc.model.player.getItemAmount("el-item-geode"))
        }
        let itemsGiven: {[key: sc.Inventory.ItemID]: number} = {}
        let chance = 1, gemsGotten = 1;

        sc.model.player.removeItem("el-item-geode", geodesLeft)

        while(geodesLeft-- > 0) {
            chance = 1;
            gemsGotten = 1;

            while(chance >= Math.random()) {
                let gem = sc.BOOSTER_GEMS.random()
                if (itemsGiven[gem]) itemsGiven[gem]++
                else itemsGiven[gem] = 1

                gemsGotten++;
                chance /= gemsGotten
                chance *= 1.5
            }
        }

        for(let [item, count] of Object.entries(itemsGiven)){ 
            sc.model.player.addItem(item, count)
        }
    }
})