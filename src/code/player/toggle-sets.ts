export default function () {
    // special toggle sets
    sc.NewGamePlusModel.inject({
        get(b) {
            switch (b) {
                case "lea-must-die":
                    if (sc.model.player.getToggleItemState("el-toggle-one-hit-die")) return true
                case "disable-exp":
                    if (sc.model.player.getToggleItemState("el-toggle-no-xp")) return true
            };
            return this.parent(b)
        }
    })

    ig.EffectSheet.inject({
        spawnFixed(effectName, x, y, z, target, effectSettings) {
            if (this.path === "combatant" && effectName === "boom_medium" && sc.model.player.getToggleItemState("el-toggle-dr-explosion")) {
                effectName = "boom_medium_deltarune"
            }
            return this.parent(effectName, x, y, z, target, effectSettings)
        }
    })

}