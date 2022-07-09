import gui from "./gui.js";
import gemDatabase from "./gem-database.js";
import params from "./params.js"

export default function() {
    el.GEM_COLORS = {
        DEFAULT: 0,
        RUBY: 1,
        GARNET: 2,
        DIAMOND: 3,
        MOONSTONE: 4,
        CITRINE: 5,
        TOPAZ: 6,
        AMETHYST: 7,
        EMERALD: 8,
        LAPIS_LAZULI: 9,
        AQUAMARINE: 10,
        ONYX: 11,
        BLOODSTONE: 12,
    }

    gemDatabase();
    gui();
    params();

    //@ts-ignore
    el.addDebugGems = () => {
        el.gemDatabase.createGem("MAXHP", 5);
        el.gemDatabase.createGem("MAXHP", 6);
        el.gemDatabase.createGem("ATTACK", 3);
        el.gemDatabase.createGem("ATTACK", 6);
        el.gemDatabase.createGem("DEFENSE", 4);
        el.gemDatabase.createGem("DEFENSE", 2);
        el.gemDatabase.createGem("FOCUS", 3);
        el.gemDatabase.createGem("FOCUS", 1);

    }
}