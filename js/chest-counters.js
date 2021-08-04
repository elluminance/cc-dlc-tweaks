sc.MapWorldMap.inject({
    _setAreaName(a){
        this.parent(a)
        let area = a.area,
            chestCount = sc.stats.getMap("chests", a.key),
            totalChests = sc.map.getChestCount(a.key),
            chestString = ""
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
        if (totalChests != 0){
            chestString = chestCount >= totalChests ? ` \\c[3][${chestCount}/${totalChests}]\\c[0]` : ` [${chestCount}/${totalChests}]`
        }
        this.areaName.setText(ig.LangLabel.getText(area.name) + chestString);
    }
})