el.GauntletXpBar = ig.GuiElementBase.extend({
    gfx: new ig.Image("media/gui/el-mod-gui.png"),
    curVal: 0,
    blinkTimer: 0,

    update() {
        if(!el.gauntlet.active) return;

        let target = el.gauntlet.runtime.curXp.limit(0, 1000);

        if(this.curVal !== target) {
            this.curVal += (target - this.curVal).limit(-16, 16);
        }

        this.blinkTimer += ig.system.tick * 20;
    },
    
    updateDrawables(renderer) {
        if(el.gauntlet.active) {
            renderer.addGfx(this.gfx, 0, 0, 23, 7, 55, 2);
            renderer.addColor("#009fff", 3, 0, (this.curVal / 1000) * 48, 1);

            if(this.curVal >= 1000) {
                renderer.addColor("#ffffff", 3, 0, 48, 1).setAlpha(Math.abs(Math.sin(this.blinkTimer)));
            }
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

el.GauntletExpEntry = sc.ExpEntryGui.extend({
    gfx: new ig.Image("media/gui/el-mod-gui.png"),

    updateDrawables(renderer) {
        let width = this.withLabel ? 36 : 13;
        let height = this.hook.size.y;

        renderer.addGfx(this.gfx, 0, 0, this.withLabel ? 78 : 119, 5, width, height)
        renderer.addColor("black", width, 0, this.hook.size.x - 6 - width, height);
        renderer.addGfx(this.gfx, this.hook.size.x - 6, 0, 132, 5, 6, height);
    },
})

el.GauntletExpHud = sc.ExpHudGui.extend({
    init() {
        this.parent();
        sc.Model.addObserver(el.gauntlet, this);
        this.removeChildGui(this.baseEntry);
        this.baseEntry = new el.GauntletExpEntry(true);
        this.baseEntry.doStateTransition("HIDDEN", true);
        this.addChildGui(this.baseEntry);
    },

    addExp(exp) {
        if (this.expSum) {
            let entry = new el.GauntletExpEntry(false, exp);
            entry.doStateTransition("HIDDEN", true);
            entry.doStateTransition("DEFAULT");
            this.expAddEntries.push(entry);
            this.insertChildGui(entry, Math.max(this.hook.children.length - 2, 0));
            this.timer = 2
        } else {
            this.expSum = exp;
            this.baseEntry.doStateTransition("DEFAULT");
            this.baseEntry.setExp(exp);
            this.timer = 5
        }
        this.expAddEntries.length > 3 ? this.mergeExpEntry() : this.reorder()
    },

    modelChanged(model, message, data) {
        if(model === el.gauntlet) {
            switch(message) {
                case el.GAUNTLET_MSG.EXP_CHANGED:
                    this.addExp(data as number)
                    break;
            }
        } else {
            this.parent(model, message, data)
        }
    }
})

sc.StatusUpperGui.inject({
    init() {
        this.parent();
        let expHud = this.hook.children.find(x => x.gui instanceof sc.ExpHudGui)!.gui as sc.ExpHudGui;
        let gui = new el.GauntletExpHud;
        
        gui.setPos(expHud.hook.pos.x, expHud.hook.pos.y);

        this.addChildGui(gui);
    }
})