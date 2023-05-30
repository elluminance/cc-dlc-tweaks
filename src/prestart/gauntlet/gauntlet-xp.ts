el.GauntletXpBar = ig.GuiElementBase.extend({
    gfx: new ig.Image("media/gui/el-mod-gui.png"),
    curVal: 0,
    active: false,

    updateVal() {
        this.curVal = el.gauntlet.runtime.curXp;
    },
    
    updateDrawables(renderer) {
        if(el.gauntlet.active) {
            renderer.addGfx(this.gfx, 0, 0, 23, 7, 55, 2);
            renderer.addColor("#009fff", 3, 0, (this.curVal / 1000) * 48, 1);
        }
    },
})

sc.HpHudGui.inject({
    el_GauntletXp: null,

    init(params) {
        this.parent(params);

        this.el_GauntletXp = new el.GauntletXpBar;
        this.el_GauntletXp.setPos(15, this.hook.size.y - 1);

        this.addChildGui(this.el_GauntletXp);
    }
})