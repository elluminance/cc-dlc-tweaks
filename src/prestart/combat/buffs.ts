
//@ts-expect-error enums do not like being assigned values
sc.COMBAT_PARAM_MSG.BUFF_CHANGED = Math.max(...Object.values(sc.COMBAT_PARAM_MSG)) + 1;

sc.CombatParams.inject({
    modifyDynamicBuff(buff, statChangeSettings, resetTimer) {
        if (!(buff instanceof sc.DynamicBuff)) return false;
        let tempHp = this.getStat("hp") - this.currentHp;
        buff.changeStat(statChangeSettings, resetTimer)
        this.currentHp = this.getStat("hp") - tempHp;
        sc.Model.notifyObserver(this, sc.COMBAT_PARAM_MSG.STATS_CHANGED)
        return true;
    },
})

sc.BuffHudEntry.inject({
    init(buff, id, x) {
        this.parent(buff, id, x);
        this.buff.buffHudEntry = this;
        //@ts-ignore
        this.textGui = this.getChildGuiByIndex(0).gui
    },

    setIcon(iconString) {
        this.textGui.setText(iconString);
        this.hook.size.x = this.textGui.hook.size.x + 6;
        sc.Model.notifyObserver(sc.model.player.params, sc.COMBAT_PARAM_MSG.BUFF_CHANGED);
    },

    updateDrawables(renderer) {
        this.parent(renderer);
        if (this.buff.hasTimer && this.buff.customTimerColor) {
            let ratio = Math.ceil(this.buff.getTimeFactor() * 8);
            if (ratio > 0) renderer.addColor(this.buff.customTimerColor, this.hook.size.x - 4, this.hook.size.y - 1 - ratio, 2, ratio);
        }
    }
})

sc.BuffHudGui.inject({
    modelChanged(model, message, data) {
        this.parent(model, message, data);
        if (message === sc.COMBAT_PARAM_MSG.BUFF_CHANGED) this.sortSlots();
    }
})

sc.DynamicBuff = sc.StatChange.extend({
    active: true,
    hasTimer: false,
    time: 0,
    timer: 0,

    init(statChanges, name, time, color) {
        this.name = name;
        this.parent(statChanges);
        if (time) {
            this.time = this.timer = time;
            this.hasTimer = true;
            if (color) this.customTimerColor = color;
        }
    },
    update() {
        if (this.timer > 0) {
            this.timer -= ig.system.tick;
            if (this.timer <= 0) this.timer = 0;
        }
        return !this.active;
    },
    getTimeFactor() {
        return this.active ? this.hasTimer ? this.timer / this.time : 1 : 0;
    },
    reset(time) {
        this.timer = this.time = time;
    },
    changeStat(statChanges, resetTimer) {
        this.params = {
            hp: 1,
            attack: 1,
            defense: 1,
            focus: 1,
            elemFactor: [1, 1, 1, 1]
        },
        this.modifiers = {};
        //@ts-ignore
        this.init(statChanges, this.name);
        //@ts-ignore stupid "this" context nobody likes you "this" context
        resetTimer && this.reset(typeof resetTimer === "boolean" ? this.time : resetTimer)
        this.buffHudEntry?.setIcon(this.iconString!);
    },
})

ig.ACTION_STEP.ADD_ACTION_BUFF.inject({
    init(settings) {
        this.parent(settings);
        this.timer = settings.timer;
        this.customColor = settings.customColor;
    },
    start(target) {
        this.parent(target);

        let targetEntity = this.target(target as ig.ENTITY.Combatant);
        if (targetEntity) {
            let buff = targetEntity.params.buffs.last() as sc.ActionBuff;
            if (this.timer) {
                buff.timer = buff.time = this.timer;
                buff.hasTimer = true;
            }
            if (this.customColor) buff.customTimerColor = this.customColor;
        }
    }
})

sc.ActionBuff.inject({
    update() {
        if (this.hasTimer) {
            if (this.time > 0) this.time -= ig.system.tick;
        }
        return this.parent();
    },
    getTimeFactor() {
        return (this.active && this.hasTimer) ? this.time / this.timer : this.parent();
    }
})