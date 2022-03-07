export default function () {
    sc.CombatStatusBase.inject({
        getInflictValue(value, defenderParams, attackInfo, shieldResult) {
            let parentValue = this.parent(value, defenderParams, attackInfo, shieldResult),
                factor = (value * this._getOffensiveFactor(attackInfo) / 12);
            
            parentValue /= factor;
            console.log(parentValue);

            parentValue = Math.min(parentValue, 1 - defenderParams.getModifier(this.defenseModifier) - defenderParams.getModifier("EL_COND_GUARD_ALL"))
            console.log(parentValue);
            return parentValue * factor;
        },

        getEffectiveness(params) {
            return Math.max(0, this.parent(params) - params.getModifier("EL_COND_GUARD_ALL") * this.effectiveness);
        }
    })
}