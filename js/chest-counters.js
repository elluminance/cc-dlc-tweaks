function getAreaDLCChestCount(area) {
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
            if(ig.extensions.enabled["post-game"]){
                count += ig.vars.get("maps.bergen/special/monksQuestcave3.chestGet") ? 1 : 0
            }
            break;

        case "heat-area":
            if(ig.extensions.enabled["scorpion-robo"]){
                count += ig.vars.get("maps.heat/lab/roomFinal.chest_89") ? 1 : 0
            }
            break;
// preparing for the future :)
/*      case "bergen-trail":
            if(ig.extensions.enabled["snowman-tank"]){
                count += ig.vars.get() ?? 0
            }
            break;

        case "autumn-fall":
            if(ig.extensions.enabled["flying-hedgehag"]){
                count += ig.vars.get() ?? 0
            }
            break;

        case "jungle":
            if(ig.extensions.enabled["fish-gear"]){
                count += ig.vars.get() ?? 0
            }
            break; 
*/
    }
    return count;
}

function getExtraChests(area) {
    switch(area){
        case "rhombus-sqr":
            return ig.extensions.enabled["post-game"] ? 7 : 0
        case "bergen":
            return ig.extensions.enabled["post-game"] ? 1 : 0
        case "heat-area":
            return ig.extensions.enabled["scorpion-robo"] ? 1 : 0
        /*case "bergen-trail": //preparing for the future!
            return ig.extensions.enabled["snowman-tank"] ? 1 : 0
        case "autumn-fall":
            return ig.extensions.enabled["flying-hedgehag"] ? 1 : 0
        case "jungle":
            return ig.extensions.enabled["fish-gear"] ? 1 : 0*/
        default:
            return 0
    }
}

sc.MapWorldMap.inject({
    _setAreaName(a){
        this.parent(a)
        let area = a.area,
            chestCount = sc.stats.getMap("chests", a.key) ?? 0,
            totalChests = sc.map.getChestCount(a.key) ?? 0,
            chestString = ""
        if(ig.extensions.enabled["post-game"]){ 
            totalChests += (a.key == "rhombus-sqr") ? 7
                         : (a.key == "bergen") ? 1 : 0;
        }
        if(ig.extensions.enabled["scorpion-robo"]) totalChests += a.key == "heat-area" ? 1 : 0
        
        // preparing for the future
        /*
         *  if(ig.extensions.enabled["snowman-tank"]) totalChests += a.key == "bergen-trail" ? 1 : 0
         *  if(ig.extensions.enabled["flying-hedgehag"]) totalChests += a.key == "autumn-fall" ? 1 : 0
         *  if(ig.extensions.enabled["fish-gear"]) totalChests += a.key == "jungle" ? 1 : 0
         */
        chestCount += getAreaDLCChestCount(a.key)

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
            count += sc.stats.getMap("chests", "evo-village")
            count += sc.stats.getMap("chests", "beach")
            count += sc.stats.getMap("chests", "final-dng")
        }

        count += getAreaDLCChestCount("rhombus-sqr");
        count += getAreaDLCChestCount("bergen");
        count += getAreaDLCChestCount("heat-area");
        // preparing for the future
        /* count += getAreaDLCChestCount("autumn-fall");
         * count += getAreaDLCChestCount("bergen-trail");
         * count += getAreaDLCChestCount("jungle");
         */
        return asPercent ? (count/total) : count
    },

    getTotalChests(){
        // 7 (rhombus) + 1 (bergen) + 6 (homestedt) + 13 (azure) + 16 (ku'lero) = 43 total DLC chests
        return this.parent() + ((ig.extensions.enabled["post-game"]) ? 43 : 0) + 
               (ig.extensions.enabled["scorpion-robo"] ? 1 : 0)/* + //preparing for the future
               (ig.extensions.enabled["snowman-tank"] ? 1 : 0) +
               (ig.extensions.enabled["flying-hedgehag"] ? 1 : 0) +
               (ig.extensions.enabled["fish-gear"] ? 1 : 0)*/
    }
})

sc.STATS_BUILD[sc.STATS_CATEGORY.EXPLORATION].chestAres.getSettings = area => {
    return !sc.map.getVisitedArea(area) || !sc.map.areas[area].track || !sc.map.areas[area].chests ? null : {
        highlight: true,
        displayName: sc.map.getAreaName(area, false, true),
        map: "chests",
        stat: area,
        max: () => {
            return sc.map.areas[area].chests + getExtraChests(area)
        }
    }
}

sc.MapChestDisplay.inject({
    update() {
        this.parent()
        switch(sc.map.currentArea.path){
            case "rhombus-sqr":
                this.max.setNumber(this._oldMax + (ig.extensions.enabled["post-game"] ? 7 : 0))
                break;
            case "bergen":
                this.max.setNumber(this._oldMax + (ig.extensions.enabled["post-game"] ? 1 : 0))
                break;
            case "heat-area":
                this.max.setNumber(this._oldMax + (ig.extensions.enabled["scorpion-robo"] ? 1 : 0))
                break;
            // preparing for the future
            /*case "bergen-trail":
                this.max.setNumber(this._oldMax + (ig.extensions.enabled["snowman-tank"] ? 1 : 0))
                break;
            case "autumn-fall":
                this.max.setNumber(this._oldMax + (ig.extensions.enabled["flying-hedgehag"] ? 1 : 0))
                break;
            case "jungle":
                this.max.setNumber(this._oldMax + (ig.extensions.enabled["fish-gear"] ? 1 : 0))
                break;
            */
        }
        this.current.setNumber(this._oldCount + getAreaDLCChestCount(sc.map.currentArea.path))
    }
})