sc.MapWorldMap.inject({
    _setAreaName(a){
        this.parent(a)
        let area = a.area,
            chestCount = sc.stats.getMap("chests", a.key) ?? 0,
            totalChests = sc.map.getChestCount(a.key) ?? 0,
            chestString = ""
        if(ig.vars.get("plot.line") >= 40000) {
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
        this.parent(asPercent);
        let count = 0, total = 0;
        for(const area in this.areas){
            if(!this.areas[area]['track']) continue;
            count += sc.stats.getMap("chests", area) ?? 0;
            total += this.areas[area]["chests"] ?? 0;
        }
        count += ig.vars.get("dlctweaks.chests.rhombus-sqr");
        count += ig.vars.get("dlctweaks.chests.bergen");
        total += 8;
        return asPercent ? (count/total) : count
    }
})