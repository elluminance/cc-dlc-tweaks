sc.Arena.inject({
    init(){
        this.parent()
        this.trackedCups.push(
            "console-cup-1",
            "ancient-cup",
            "ancient-boss-cup",
            "ancient-team-cup",
            "faction-cup-3",
            "vermillion-cup",
            "lily-cup",
            "apollo-cup",
            "shizuka-cup",
            "kit-cup",
            "guest-cup-1",
            "sidwell", 
            "observers-cup"
        )

        this.registerCup('sidwell', {order: 100, id: "sidwell"});
        this.registerCup('observers-cup', {order: 1001, id: "observers-cup"});
    },

    /*
    * this workaround exists for one reason, and one reason only.
    * to counter sergey's hack buff, it effectively works by dividing
    * the buff value to get the "normalized" damage. works great on enemies
    * with high HP, but not high defense.
    * 
    * this workaround is dirty, and i know it. but it was honestly just the easiest way
    */
    onPreDamageApply(a, b, c, d, e) {
        if(ig.vars.get("tmp.sidwell-arena")){
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
    },

    onVarAccess(varString, varParts) {
        if(varParts[0] == "arena") {
            switch(varParts[1]) {
                case "totalTruePlatsNoIncludeNoRush":
                    let num = 0;
                    this.trackedCups.forEach(key => {
                        if(this.getCupCoreAttrib(key, "noRush")
                          && (this.getCupRounds(key).length < 2)) return;
                        else if(this.getCupTrophy(key) === 5) num++;
                    });
                    return num;
            }
        }
        return this.parent(varString, varParts)
    }
})

sc.ARENA_BONUS_OBJECTIVE.INTERROGATION_HITS = {
    _type: "EMPTY",
    order: 1E5,
    displayRangePoints: true,

    init: function(a, b) {
        b._maxHits = a.value;
    },
    check: function(a) {
        return ig.vars.get("tmp.ctronHits") as number <= a._maxHits;
    },
    getText(a, b, c) {
        return a.replace("[!]", !c ? b.value : `${ig.vars.get("tmp.ctronHits") ?? 0}\\i[slash-highlight]${b._maxHits}`)
    },
    getPoints(a, b) {
        return (1 - ((ig.vars.get("tmp.ctronHits") as number ?? 0) / a._maxHits)).limit(0, 1) * b
    }
}
