import type { Mod, LegacyPluginClass } from "../node_modules/ultimate-crosscode-typedefs/modloader/mod";

export default class implements LegacyPluginClass {
    constructor(public mod: Mod) {}

    preload() {
        //@ts-expect-error
        if(!window.el) window.el = {};
    }

    prestart() {
        import("./prestart/prestart.js");
    }

    poststart() {
        //import("./poststart/poststart.js");
        el.gemDatabase = new el.GemDatabase;
    }
}