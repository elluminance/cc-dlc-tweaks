//copied+modified from the game's RANKED gui.
el.GauntletCombatUpperHud = ig.GuiElementBase.extend({
    gfx: new ig.Image("media/gui/status-gui.png"),

    init() {
        this.parent();
        this.setSize(49, 20);
        this.rankLabel = new sc.TextGui(ig.lang.get("sc.gui.el-gauntlet.rank"), {
            font: sc.fontsystem.tinyFont
        });
        this.rankLabel.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.rankLabel.setPos(28, 1);
        this.rankValue = new sc.TextGui("A");
        this.rankValue.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.rankValue.setPos(18, -2);
        this.addChildGui(this.rankLabel);
        this.addChildGui(this.rankValue);
    },

    start() {
        sc.Model.addObserver(el.gauntlet, this);
        this.rankValue.setText(el.gauntlet.getRankLabel());
        this.progress = 0
    },
    end() {
        sc.Model.removeObserver(el.gauntlet, this);
    },

    update() {
        let progress = el.gauntlet.getRankProgress();

        if(el.gauntlet.isSRank()) this.progress = progress;
        else if (this.progress !== progress) {
            this.progress = 0.05 * progress + 0.95 * this.progress;
            if (Math.abs(this.progress - progress) < 0.005) {
                this.progress = progress
            }
        }
        this.blinkTimer = (el.gauntlet.isSRank() || el.gauntlet.isRankDecaying()) ? this.blinkTimer + ig.system.actualTick : 0
    },

    updateDrawables(renderer) {
        let hook = this.hook;
        renderer.addGfx(this.gfx, hook.size.x - 18, 0, 160, 96, 13, 13);
        let size = Math.round(22 * this.progress);
        renderer.addGfx(this.gfx, hook.size.x - 50, 8, 128, 112, 24, 3);
        let blinkAlpha = 1 - Math.abs(Math.sin(this.blinkTimer / 0.2 * Math.PI));
        if(el.gauntlet.isRankDecaying() && size) {
            renderer.addGfx(this.gfx, hook.size.x - 50, 8, 128, 112 + 8, 1 + size, 3)
        }
        renderer.addTransform().setAlpha(blinkAlpha);
        if(size) {
            renderer.addGfx(this.gfx, hook.size.x - 50, 8, 128, 112 + 4, 1 + size, 3);
        }
        renderer.undoTransform()
    },

    modelChanged(model, message, data) {
        if(model === el.gauntlet) {
            switch(message) {
                case el.GAUNTLET_MSG.RANK_CHANGED:
                    this.progress = data ? 1 : 0;
                    this.rankValue.setText(el.gauntlet.getRankLabel());
            }
        }
    },
})

sc.CombatUpperHud.inject({
    init() {
        this.parent();
        this.sub.elGauntlet = new el.GauntletCombatUpperHud;
        sc.Model.addObserver(el.gauntlet, this);
    },

    showGauntletHud() {
        if(this.currentSub) {
            this.currentSub.end();
            this.removeChildGui(this.currentSub);
        }

        this.currentSub = this.sub.elGauntlet;
        this.addChildGui(this.sub.elGauntlet);
        this.currentSub.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.currentSub.start();
    },

    modelChanged(model, message, data) {
        if(model === el.gauntlet) {
            switch (message) {
                case el.GAUNTLET_MSG.ROUND_STARTED:
                    this.showGauntletHud();
            }
        } else this.parent(model, message, data);
    },
})