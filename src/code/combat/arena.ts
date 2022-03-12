export default function() {
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
}
