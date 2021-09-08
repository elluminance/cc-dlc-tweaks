sc.TROPHY_ICONS.BOSS_APOLLO_4 = {
    index: -1,
    cat: "COMBAT",
    hidden: true,
    sheet: "dlc-tweaks",
    customIndex: 0
}

sc.TROPHY_ICONS.CHESTS_BEACH = {
    index: -1,
    cat: "EXPLORATION",
    sheet: "dlc-tweaks",
    customIndex: 1
}

sc.TROPHY_ICONS.CHESTS_FINAL_DNG = {
    index: -1,
    cat: "EXPLORATION",
    sheet: "dlc-tweaks",
    customIndex: 2
}

sc.TROPHY_ICONS.CHESTS_EVO_VILLAGE = {
    index: -1,
    cat: "EXPLORATION",
    sheet: "dlc-tweaks",
    customIndex: 3
}

sc.TROPHY_ICONS.LANDMARKS_DLC = {
    index: -1,
    cat: "EXPLORATION",
    sheet: "dlc-tweaks",
    customIndex: 4
}

sc.TROPHY_ICONS.BOSS_GODS = {
    index: -1,
    cat: "COMBAT",
    hidden: true,
    sheet: "dlc-tweaks",
    customIndex: 5
}

sc.TROPHY_ICONS.BOSS_SIDWELL = {   
    index: -1,
    cat: "COMBAT",
    hidden: true,
    sheet: "dlc-tweaks",
    customIndex: 6
}

sc.TROPHY_ICONS.STORY_DLC = {
    index: -1,
    cat: "GENERAL",
    sheet: "dlc-tweaks",
    customIndex: 7
}

sc.TrophyIconGraphic.inject({
    customIcons: {
        "dlc-tweaks": new ig.Image("media/gui/dlctweaks-trophies.png")
    },

    init(a, b, e, f){
        this.parent(a, b, e, f);
        let iconIndex = f ? (sc.TROPHY_ICONS[a] || 0).index : 0;
        if(iconIndex == -1){
            let customIndex = sc.TROPHY_ICONS[a].customIndex;
            this.removeChildGui(this.icon);
            
            this.icon = new ig.ImageGui(this.customIcons[sc.TROPHY_ICONS[a].sheet], customIndex % 12 * 42, ~~(customIndex / 12) * 42, 42, 42);
            this.addChildGui(this.icon);
            this.removeChildGui(this.ribbon);
            this.addChildGui(this.ribbon);
        }
    }
})