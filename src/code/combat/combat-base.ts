import ascendedBooster from "./ascended-booster.js"
import arena from "./arena.js"
import buff from "./buffs.js";
import combatantEntity from "./combatant-entity.js";
import combatModel from "./combat-model.js"
import consumables from "./consumables.js"
import overhealing from "./overhealing.js";
import proxyEntity from "./proxy.js"
import statusEffect from "./status-effect.js";

export default function() {
    arena();
    consumables();
    ascendedBooster();
    statusEffect();
    overhealing();
    combatantEntity();
    proxyEntity();
    buff();
    combatModel();

    sc.COMBAT_FLY_LEVEL["LIGHTER"] = {
        vel: 75,
        stun: 0.2,
        jump: 0
    }
}