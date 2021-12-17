sc.Arena.inject({
    trackedCups: [
        "rookie-cup",
        "seeker-cup",
        "boss-cup",
        "faction-cup-1",
        "faction-cup-2",
        "rookie-team-cup",
        "faction-team-cup-1",
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
    ],

    init(){
        this.parent()
        this.registerCup('sidwell', {order: 100, id: "sidwell"});
        this.registerCup('observers-cup', {order: 1001, id: "observers-cup"});
        this.trackedCups.push('sidwell', 'observers-cup');
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

    getTotalArenaCompletion(){
        var a: number, b: number;
        a = b = 0;
        this.trackedCups.forEach(cupName => {a += this.getCupCompletion(cupName); b++;})
        return a / b;
    },

    getTotalDefaultTrophies: function(a, c) {
        var d = 0, e = 0;
        this.trackedCups.forEach((f: string) => {
            var g = this.getCupTrophy(f);
            if (this.isCupUnlocked(f))
                if (a == 0) {
                    d = d + g;
                    e = e + 5
                } else {
                    g >= a && d++;
                    e++
                }
        })
        return c ? e : d
    },

    getTotalDefaultCups(sorted){
        let cups: {[key: string]: sc.ArenaCup} = {};
        this.trackedCups!.forEach(a => {
            let order = sc.arena.cups[a].order || 1e7;
            if(this.isCupCustom(a)) order += 1e7;
            cups[a] = {order}
        })
        if(sorted){
            let sortedCups: {[key: string]: sc.ArenaCup} = {}
            Object.keys(cups)
                  .sort((element1: string, element2: string) => (cups[element1]!.order - cups[element2]!.order))
                  .forEach(key => void(sortedCups[key] = cups[key]))
            return sortedCups;
        }
        return cups
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
