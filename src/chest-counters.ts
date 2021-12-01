function getAreaDLCChestCount(area: string): number {
    let count = 0;
    switch(area){
        case "rhombus-sqr":
            if(ig.extensions.enabled["post-game"]){
                count += ig.vars.get("maps.rhombusSqr/centerS.chest_888") ? 1 : 0
                count += ig.vars.get("maps.rhombusSqr/centerNe.chest_5") ? 1 : 0
                count += ig.vars.get("maps.rhombusSqr/centerN.chest_197") ? 1 : 0
                count += ig.vars.get("maps.rhombusSqr/centerNe.chest_437") ? 1 : 0
                count += ig.vars.get("maps.rhombusSqr/centerNw.chest_251") ? 1 : 0
                count += ig.vars.get("maps.rhombusSqr/centerW.chest_305") ? 1 : 0
                count += ig.vars.get("maps.rhombusSqr/beachSw.chest_1096") ? 1 : 0
            }
            break;

        case "bergen":
            if(ig.extensions.enabled["post-game"]) count += ig.vars.get("maps.bergen/special/monksQuestcave3.chestGet") ? 1 : 0
            break;

        case "heat-area":
            if(ig.extensions.enabled["scorpion-robo"]) count += ig.vars.get("maps.heat/lab/roomFinal.chest_89") ? 1 : 0
            break;
        // preparing for the future :)
        case "bergen-trails":
            if(ig.extensions.enabled["snowman-tank"]) count += ig.vars.get("maps.bergenTrail/lab/roomFinal.chest_54") ? 1 : 0
            break;

        case "autumn-fall":
            if(ig.extensions.enabled["flying-hedgehag"]) count += ig.vars.get("maps.autumn/lab/roomFinal.chest_55") ? 1 : 0
            break;

        case "jungle":
            if(ig.extensions.enabled["fish-gear"]) count += ig.vars.get("maps.jungle/lab/roomFinal.chest_59") ? 1 : 0
            break;

        // modded chests
        case "beach":
            if(ig.extensions.enabled["post-game"]) count += ig.vars.get("maps.beach/temple.chest_2441");
        case "final-dng":
            if(ig.extensions.enabled["post-game"]) count += ig.vars.get("maps.finalDng/g/outdoor-01.chest_24410");
    }
    return count;
}

function getExtraChests(area: string): number {
    switch(area){
        case "rhombus-sqr":
            return ig.extensions.enabled["post-game"] ? 7 : 0
        case "bergen":
            return ig.extensions.enabled["post-game"] ? 1 : 0
        case "heat-area":
            return ig.extensions.enabled["scorpion-robo"] ? 1 : 0
        case "bergen-trails":
            return ig.extensions.enabled["snowman-tank"] ? 1 : 0
        case "autumn-fall":
            return ig.extensions.enabled["flying-hedgehag"] ? 1 : 0
        case "jungle":
            return ig.extensions.enabled["fish-gear"] ? 1 : 0
        
        case "beach":
            return ig.extensions.enabled["post-game"] ? 1 : 0
        case "final-dng":
            return ig.extensions.enabled["post-game"] ? 1 : 0

        default:
            return 0
    }
}

sc.StatsModel.inject({
    getMap(b, a){
        let value = this.parent(b, a);
        if(b === "chests") {
            value += getAreaDLCChestCount(a)
        }
        return value
    }
})

sc.MapWorldMap.inject({
    _setAreaName(a){
        this.parent(a)
        let area = a.area,
            chestCount = sc.stats.getMap("chests", a.key) || 0,
            totalChests = sc.map.getChestCount(a.key) || 0,
            chestString = ""

        totalChests += getExtraChests(a.key) 

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
            count += sc.stats.getMap("chests", "evo-village") || 0
            count += sc.stats.getMap("chests", "beach") || 0
            count += sc.stats.getMap("chests", "final-dng") || 0
        }

        count += getAreaDLCChestCount("rhombus-sqr");
        count += getAreaDLCChestCount("bergen");
        count += getAreaDLCChestCount("heat-area");
        count += getAreaDLCChestCount("autumn-fall");
        count += getAreaDLCChestCount("bergen-trails");
        count += getAreaDLCChestCount("jungle");

        count += getAreaDLCChestCount("beach");
        count += getAreaDLCChestCount("final-dng");
        
        return asPercent ? (count/total) : count
    },

    getTotalChests(){
        // 7 (rhombus) + 1 (bergen) + 6 (homestedt) + 13 (azure) + 16 (ku'lero) = 43 total DLC chests
        return this.parent() + ((ig.extensions.enabled["post-game"]) ? (43 + 2) : 0) + 
               (ig.extensions.enabled["scorpion-robo"] ? 1 : 0) + 
               (ig.extensions.enabled["snowman-tank"] ? 1 : 0) +
               (ig.extensions.enabled["flying-hedgehag"] ? 1 : 0) +
               (ig.extensions.enabled["fish-gear"] ? 1 : 0)
    }
})

sc.STATS_BUILD[sc.STATS_CATEGORY.EXPLORATION].chestAres.getSettings = area => {
    return !sc.map.getVisitedArea(area) || !sc.map.areas[area].track || !sc.map.areas[area].chests ? null : {
        highlight: true,
        displayName: sc.map.getAreaName(area, false, true),
        map: "chests",
        stat: area,
        max: () => (sc.map.areas[area].chests + getExtraChests(area))
    }
}

sc.MapChestDisplay.inject({
    update() {
        this.parent()
        this.max.setNumber(this._oldMax + getExtraChests(sc.map.currentArea.path))
        this.current.setNumber(this._oldCount)
    }
})