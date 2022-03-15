import { Mod, PluginClass } from "../node_modules/ultimate-crosscode-typedefs/modloader/mod";

//#region prestart declarations
import actionStep from "./code/steps/action-step.js"
import arena from "./code/combat/arena.js"
import chestCounters from "./code/menu/chest-counters.js"
import consumables from "./code/combat/consumables.js"
import icon from "./code/menu/icon.js"
import vars from "./code/misc/vars.js"
import saveStar from "./code/menu/save-star.js"
import trophyIcons from "./code/menu/trophy-icons.js"
import modifier from "./code/player/modifier.js"
import toggleSets from "./code/player/toggle-sets.js"
import ascendedBooster from "./code/combat/ascended-booster.js"
import effectEntry from "./code/steps/effect-entry.js"
import trades from "./code/misc/trades.js"
import shop from "./code/menu/shop.js"
import eventStep from "./code/steps/event-step.js"
import geode from "./code/menu/geode.js"
import playerConfig from "./code/player/player-config.js"
import statusEffect from "./code/combat/status-effect.js";
//#endregion

//#region poststart declarations
import combatArt from "./code/player/combat-art.js"
//#endregion

export default class implements PluginClass {
    constructor(public mod: Mod) {}

    prestart() {
        actionStep();
        arena();
        chestCounters();
        consumables();
        icon();
        vars();
        saveStar();
        trophyIcons();
        modifier();
        toggleSets();
        ascendedBooster();
        effectEntry();
        trades();
        shop();
        eventStep();
        geode();
        playerConfig();
        statusEffect();
    }

    poststart() {
        combatArt(); //will enabled when needed
    }
}