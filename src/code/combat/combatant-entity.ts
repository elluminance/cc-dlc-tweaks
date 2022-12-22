sc.BasicCombatant.inject({
    onVarAccess(a, b) {
        if (b[1] == "targetingSelf") return this.getTarget() == this;
        return this.parent(a, b)
    }
})
