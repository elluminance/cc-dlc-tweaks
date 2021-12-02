sc.MapModel.inject({
    /* an object containing with a key of the area name, 
     * corresponding to an array of new chests to check for.
     * this is a way to "trick" the game into counting untracked chests
     *
     * dear modders: it is possible to easily add an entry to this list!
     * if you want to add chests in pre-existing areas, just push them onto
     * that area's corresponding array of variables!
     * all the rest will be handled here - no additional work for you!
     * 
     * notes: make sure your modded chests are set to noTrack!
     * this fix will basically handle actually tracking those chests! :)
     * 
     * (you probably should do it in init(), if you need an idea of where to start)
     * 
     * oh, and ps: 
     * if you're making your own custom area, this workaround is unnecessary to use.
     * you can just have chests be tracked normally in your area!
    */
    extraChestList: {
        "rhombus-sqr": [
            "maps.rhombusSqr/centerS.chest_888",
            "maps.rhombusSqr/centerNe.chest_5", 
            "maps.rhombusSqr/centerN.chest_197",
            "maps.rhombusSqr/centerNe.chest_437",
            "maps.rhombusSqr/centerNw.chest_251",
            "maps.rhombusSqr/centerW.chest_305",
            "maps.rhombusSqr/beachSw.chest_1096"
        ],

        "bergen": [
            "maps.bergen/special/monksQuestcave3.chestGet"
        ],

        "heat-area": [
            "maps.heat/lab/roomFinal.chest_89"
        ],

        "bergen-trails": [
            "maps.bergenTrail/lab/roomFinal.chest_54"
        ],

        "autumn-fall": [
            "maps.autumn/lab/roomFinal.chest_55"
        ],

        "jungle": [
            "maps.jungle/lab/roomFinal.chest_59"
        ],

        "beach": [
            "maps.beach/temple.chest_2441"
        ],

        "final-dng": [
            "maps.finalDng/g/outdoor-01.chest_24410"
        ],
    },

    // returns how many modded chests have been collected
    getExtraFoundChests(area) {
        if(!this.extraChestList[area]) return 0;
        let count = 0;

        this.extraChestList[area].forEach(key => void(count += ig.vars.get(key) ? 1 : 0))

        return count;
    },
    
    // returns the total modded chests for an area
    getExtraAreaChests(area) {
        return this.extraChestList[area]?.length ?? 0
    },

    // returns the total amount of modded chests that have been found
    getTotalExtraFoundChests() {
        let count = 0;
        Object.keys(this.extraChestList).forEach(area => {count += this.getExtraFoundChests(area)})
        return count;
    },

    // returns the total number of modded chests overall
    getTotalExtraChests(){
        let count = 0;
        Object.values(this.extraChestList).forEach(areaChests => void(count += areaChests.length))
        return count;
    },

    getTotalChestsFound(asPercent) {
        let count = this.parent(false),
            total = this.getTotalChests();
        // count in postgame-exclusive areas
        count += sc.stats.getMap("chests", "evo-village") ?? 0
        count += sc.stats.getMap("chests", "beach") ?? 0
        count += sc.stats.getMap("chests", "final-dng") ?? 0
        
        // add in all extra chests.
        count += this.getTotalExtraFoundChests()
        
        return asPercent ? (count / total) : count
    },

    getTotalChests() {
        // 6 (homestedt) + 13 (azure) + 16 (ku'lero) = 35 total chests in DLC areas
        return this.parent() + 35 + this.getTotalExtraChests()
    }
})

sc.MapWorldMap.inject({
    _setAreaName(a) {
        this.parent(a)
        let area = a.area,
            chestCount = sc.stats.getMap("chests", a.key) ?? 0,
            totalChests = sc.map.getChestCount(a.key) ?? 0,
            chestString = ""

        totalChests += sc.map.getExtraAreaChests(a.key)

        if (totalChests != 0) {
            chestString = chestCount >= totalChests ? ` \\c[3][${chestCount}/${totalChests}]\\c[0]` : ` [${chestCount}/${totalChests}]`
        }
        this.areaName.setText(ig.LangLabel.getText(area.name) + chestString);
    }
})

sc.STATS_BUILD[sc.STATS_CATEGORY.EXPLORATION].chestAres.getSettings = area => {
    return !sc.map.getVisitedArea(area) || !sc.map.areas[area].track || !sc.map.areas[area].chests ? null : {
        highlight: true,
        displayName: sc.map.getAreaName(area, false, true),
        map: "chests",
        stat: area,
        max: () => (sc.map.areas[area].chests + sc.map.getExtraAreaChests(area))
    }
}

sc.MapChestDisplay.inject({
    update() {
        this.parent()
        this.max.setNumber(this._oldMax + sc.map.getExtraAreaChests(sc.map.currentArea.path))
        this.current.setNumber(this._oldCount)
    }
})