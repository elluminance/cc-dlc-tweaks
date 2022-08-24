import type { Mod, PluginClass } from "../node_modules/ultimate-crosscode-typedefs/modloader/mod";

//#region prestart declarations
import playerCore from "./code/player/player-core.js"
import gemCore from "./code/gems/core.js"
import combatCore from "./code/combat/combat-base.js";
import stepCore from "./code/steps/step-core";
import miscCore from "./code/misc/misc-core";
import menuCore from "./code/menu/menu-core";
//#endregion

//#region poststart declarations
//import combatArt from "./code/player/combat-art.js"
//#endregion

export default class implements PluginClass {
    constructor(public mod: Mod) {}

    preload() {
        //@ts-ignore
        if(!window.el) window.el = {};
    }

    prestart() {
        menuCore();
        miscCore();
        stepCore();
        playerCore();
        combatCore();
        gemCore();
    }

    poststart() {
        el.gemDatabase = new el.GemDatabase;
        //combatArt();
    }
}