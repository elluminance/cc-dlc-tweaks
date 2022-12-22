import type { Mod, LegacyPluginClass } from "../node_modules/ultimate-crosscode-typedefs/modloader/mod";

//#region poststart declarations
//import combatArt from "./code/player/combat-art.js"
//#endregion

export default class implements LegacyPluginClass {
    constructor(public mod: Mod) {}

    preload() {
        //@ts-ignore
        if(!window.el) window.el = {};
    }

    prestart() {
        import("./code/menu/menu-core.js");
        import("./code/player/player-core.js");
        import("./code/gems/core.js");
        import("./code/combat/combat-base.js");
        import("./code/steps/step-core.js");
        import("./code/misc/misc-core.js");
    }

    poststart() {
        //import("./code/player/combat-art.js");
        el.gemDatabase = new el.GemDatabase;
    }
}