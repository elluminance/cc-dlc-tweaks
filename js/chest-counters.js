sc.MapWorldMap.inject({
    _setAreaName(a){
        this.parent(a)
        let area = a.area,
            chestCount = sc.stats.getMap("chests", a.key) ?? 0,
            totalChests = sc.map.getChestCount(a.key) ?? 0,
            chestString = ""
        if(ig.extensions.enabled["post-game"]) {
            switch (a.key) {
                case "rhombus-sqr":
                    totalChests += 7;
                    chestCount += ig.vars.get("dlctweaks.chests.rhombus-sqr")
                    break;
                case "bergen":
                    totalChests += 1;
                    chestCount += ig.vars.get("dlctweaks.chests.bergen")
                    break;
            }
        }
        if (totalChests != 0){
            chestString = chestCount >= totalChests ? ` \\c[3][${chestCount}/${totalChests}]\\c[0]` : ` [${chestCount}/${totalChests}]`
        }
        this.areaName.setText(ig.LangLabel.getText(area.name) + chestString);
    }
})

sc.MapModel.inject({
    getTotalChestsFound(asPercent) {
        let count = this.parent(false), 
            total = this.getTotalChests();
        if(ig.extensions.enabled["post-game"]){
            count += ig.vars.get("dlctweaks.chests.rhombus-sqr");
            count += ig.vars.get("dlctweaks.chests.bergen");
            total += 8;
        }
        return asPercent ? (count/total) : count
    },

    getTotalChests(){
        return this.parent() + (ig.extensions.enabled["post-game"] ? 8 : 0)
    }
})