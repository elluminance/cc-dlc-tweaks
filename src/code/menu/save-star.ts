export default function() {
sc.SaveSlotButton.inject({
    setSave(save, slot, skip) {
        this.parent(save, slot, skip);
        this.chapter.showPostgameStar(save?.vars?.storage?.plot?.completedPostGame as boolean, save?.vars?.storage?.plot?.metaSpace as boolean);
    }
})

sc.SaveSlotChapter.inject({
    postgameStarGfx: new ig.Image("media/gui/el-mod-gui.png"),
    postgameStar: null,

    init() {
        this.parent()
        this.postgameStar = new ig.ImageGui(this.postgameStarGfx, 0, 0, 11, 10);
        this.postgameStar.hook.transitions = {
            DEFAULT: {
                state: {},
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            },
            HIDDEN: {
                state: {
                    alpha: 0
                },
                time: 0.2,
                timeFunction: KEY_SPLINES.LINEAR
            }
        };
        this.postgameStar.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_BOTTOM);
        this.postgameStar.setPos(12, 1);
        this.postgameStar.setPos(-15, 14);
        this.addChildGui(this.postgameStar);
    },

    showPostgameStar(dlcBeaten, gameBeaten) {
        this.postgameStar.doStateTransition(dlcBeaten ? "DEFAULT" : "HIDDEN", true)
        this.metaMarker.doStateTransition((gameBeaten && !dlcBeaten) ? "DEFAULT" : "HIDDEN", true)
    }
})
}