sc.CombatStatusBase.inject({
    getInflictValue(value, defenderParams, attackInfo, shieldResult) {
        let parentValue = this.parent(value, defenderParams, attackInfo, shieldResult),
            factor = (value * this._getOffensiveFactor(attackInfo) / 12);

        parentValue /= factor;

        parentValue = Math.min(parentValue, 1 - defenderParams.getModifier(this.defenseModifier) - defenderParams.getModifier("EL_COND_GUARD_ALL"))
        return parentValue * factor;
    },

    getEffectiveness(params) {
        return Math.max(0, this.parent(params) - params.getModifier("EL_COND_GUARD_ALL") * this.effectiveness);
    }
})