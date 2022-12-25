
sc.PlayerModel.inject({
    onVarAccess(a, b) {
        if (b[0] == "player") switch (b[1]) {
            case "totalSkillPointsExtra":
                return (this.skillPointsExtra as unknown as number[]).reduce((c, d) => (c + d), 0);
            case "model":
                return this.name
        }
        return this.parent(a, b)
    }
})

sc.StatsModel.inject({
    getMap(b, a) {
        // this may be a little bit hacky of a workaround...
        // but it's the easiest way to make a trophy based on variables rather than stats
        if (b == "varValue") return ig.vars.get(a) as number;

        return this.parent(b, a);
    }
})

// yes, this is necessary. why is it necessary?
// don't ask me. i am *just* as confused as you.
ig.addGameAddon(() => (sc.stats = new sc.StatsModel))
