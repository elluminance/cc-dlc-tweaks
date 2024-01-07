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
        if(varParts[0] === "arena") {
            switch(varParts[1]) {
                case "totalTruePlatsExcludeNoRush":
                    return this.trackedCups.filter(cupName => (
                        (!this.getCupCoreAttrib(cupName, "noRush")) // check the cup isn't set to noRush
                        && (this.getCupRounds(cupName)?.length >= 2) // and that the cup has more than 1 round
                        && (this.getCupTrophy(cupName) === sc.ARENA_MEDALS_TROPHIES.TRUE_PLATIN) // and that the player has gotten a true platinum trophy
                    )).length;
            }
            if(this.cups[varParts[1]]) {
                switch(varParts[2]) {
                    case "trophy":
                        return this.getCupTrophy(varParts[1]);
                }
            }
        }
        return this.parent(varString, varParts)
    },

    startRound() {
        if(!this.runtime.rush || this.runtime.rush && this.runtime.currentRound===0){
            ig.game.playerEntity.ignoreOverheal = true;
        }
        this.parent();
        ig.game.playerEntity.ignoreOverheal = false;
    }
})

sc.ARENA_SCORE_TYPES.EL_CTRON_CLONE_HIT = {
    order: 3,
    points: -5000,
    asMali: true,
}