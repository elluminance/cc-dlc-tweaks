
sc.CombatParams.inject({
    getStat(key, noHack) {
        let parentValue = this.parent(key, noHack);

        if (this.elGemBonuses && typeof parentValue == "number") {
            parentValue = Math.round(parentValue * (this.elGemBonuses.params[key as "hp" | "attack" | "defense" | "focus"] ?? 1))
        }

        return parentValue;
    },

    getModifier(modifier) {
        let parentValue = this.parent(modifier);
        if (this.elGemBonuses) {
            parentValue += this.elGemBonuses.modifiers[modifier] || 0;
        }
        return parentValue;
    },

    //elemFactor is handled in getDamage() in player/modifier.ts
    //...intuitive, i know. :)
})