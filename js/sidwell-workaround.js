/*
 * this workaround exists for one reason, and one reason only.
 * to counter sergey's hack buff, it effectively works by dividing
 * the buff value to get the "normalized" damage. works great on enemies
 * with high HP, but not high defense.
 * 
 * this workaround is dirty, and i know it. but it was honestly just the easiest way
 */
sc.Arena.inject({
    onPreDamageApply(a, b, c, d, e) {
        if(this.active && ig.vars.get("tmp.sidwell-arena")){
            if (this.active && !(c == sc.SHIELD_RESULT.PERFECT || d.getCombatantRoot().party != sc.COMBATANT_PARTY.PLAYER || this.isEnemyBlocked(a))) {
                c = 1;
                if (d.params.buffs.length > 0)
                    for (var d = d.params.buffs, f = 0, g = d.length; f < g; f++)
                        if (d[f] instanceof sc.ActionBuff && d[f].name == "sergeyHax") {
                            //c = e.attackerParams.getStat("attack", true) / e.attackerParams.getStat("attack", false);
                            break;
                        } a = Math.min(Math.max(0, a.params.currentHp), Math.floor(b.damage * c));
                if (a > 0) {
                    this.addScore("DAMAGE_DONE", a);
                    b = Math.floor(a - a / b.defensiveFactor);
                    if (b > 0) {
                        sc.stats.addMap("arena", "effectiveDamage", b);
                        this.addScore("DAMAGE_DONE_EFFECTIVE", b)
                    }
                }
            }
        } else this.parent(a, b, c, d, e)
    }
})