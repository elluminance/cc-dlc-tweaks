sc.COMBAT_CONDITION.TARGET_HAS_BUFF = ig.Class.extend({
    buffName: "",
    max: 0,
    min: 0,

    init(settings) {
        this.buffName = settings.buffName || "";
        this.max = settings.max || Infinity;
        this.min = settings.min || -1;
    },

    check(entity) {
        let target = entity.getTarget() as ig.ENTITY.Combatant;
        let count = 0;
        if (this.buffName) {
            count = target.params.buffs.reduce<number>((value, statChange) => value += (statChange instanceof sc.ActionBuff && statChange.name === this.buffName) ? 1 : 0, 0);
        } else {
            count = target.params.buffs.length;
        }
        console.log("count: ", count, " min: ", this.min, " max: ", this.max);
        return this.min <= count && count <= this.max;
    }
})