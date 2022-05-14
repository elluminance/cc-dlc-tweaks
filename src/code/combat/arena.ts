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
    },

    startRound() {
        if(!this.runtime.rush || this.runtime.rush && this.runtime.currentRound == 0){
            ig.game.playerEntity.ignoreOverheal = true;
        }
        this.parent();
        ig.game.playerEntity.ignoreOverheal = false;
    }
})
}
