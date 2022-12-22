sc.Combat.inject({
    showModeAura(combatant, element) {
        if (!combatant.hideModeAura) this.parent(combatant, element);
    },
    showModeDash(combatant, element) {
        if (!combatant.hideModeAura) this.parent(combatant, element);
    }
})