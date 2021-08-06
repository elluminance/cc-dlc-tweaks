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
        if(ig.extensions.enabled["post-game"] && (ig.vars.get("plot.line") >= 40000)){
            count += ig.vars.get("dlctweaks.chests.rhombus-sqr");
            count += ig.vars.get("dlctweaks.chests.bergen");
            count += sc.stats.getMap("chests", "evo-village")
            count += sc.stats.getMap("chests", "beach")
            count += sc.stats.getMap("chests", "final-dng")
        }
        return asPercent ? (count/total) : count
    },

    getTotalChests(){
        // 7 (rhombus) + 1 (bergen) + 6 (homestedt) + 13 (azure) + 16 (ku'lero) = 43 total DLC chests
        return this.parent() + ((ig.extensions.enabled["post-game"] && (ig.vars.get("plot.line") >= 40000)) ? 43 : 0)
    }
})