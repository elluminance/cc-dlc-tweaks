export default function () {
    sc.Combat.inject({
        showModeAura(combatant, element) {
            if(!combatant.hideModeAura) this.parent(combatant, element);
        }
    })
}