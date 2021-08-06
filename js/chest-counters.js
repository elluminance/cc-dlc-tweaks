function getAreaDLCChestCount(area) {
    let count = 0;
    switch(area){
        case "rhombus-sqr":
            if(ig.extensions.enabled["post-game"]){
                count += ig.vars.get("maps.rhombusSqr/centerS.chest_888") ?? 0
                count += ig.vars.get("maps.rhombusSqr/centerNe.chest_5") ?? 0
                count += ig.vars.get("maps.rhombusSqr/centerN.chest_197") ?? 0
                count += ig.vars.get("maps.rhombusSqr/centerNe.chest_437") ?? 0
                count += ig.vars.get("maps.rhombusSqr/centerNw.chest_251") ?? 0
                count += ig.vars.get("maps.rhombusSqr/centerW.chest_305") ?? 0
                count += ig.vars.get("maps.rhombusSqr/beachSw.chest_1096") ?? 0
            }
            break;
        case "bergen":
            if(ig.extensions.enabled["post-game"]){
                count += ig.vars.get("maps.bergen/special/monksQuestcave3.chestGet") ?? 0
            }
            break;
    }
    return count;
}

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
                    chestCount += getAreaDLCChestCount("rhombus-sqr")
                    break;
                case "bergen":
                    totalChests += 1;
                    chestCount += getAreaDLCChestCount("bergen")
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
            count += getAreaDLCChestCount("rhombus-sqr");
            count += getAreaDLCChestCount("bergen");
            count += sc.stats.getMap("chests", "evo-village")
            count += sc.stats.getMap("chests", "beach")
            count += sc.stats.getMap("chests", "final-dng")
        }
        return asPercent ? (count/total) : count
    },

    getTotalChests(){
        // 7 (rhombus) + 1 (bergen) + 6 (homestedt) + 13 (azure) + 16 (ku'lero) = 43 total DLC chests
        return this.parent() + ((ig.extensions.enabled["post-game"]) ? 43 : 0)
    }
})

sc.MapChestDisplay.inject({
    update() {
        this.parent()
        switch(sc.map.currentArea.path){
            case "rhombus-sqr":
                this.max.setNumber(this._oldMax + 7)
                this.current.setNumber(this._oldCount + getAreaDLCChestCount("rhombus-sqr"))
                break;
            case "bergen":
                this.max.setNumber(this._oldMax + 1)
                this.current.setNumber(this._oldCount + getAreaDLCChestCount("rhombus-sqr"))
                break;
        }
    }
})