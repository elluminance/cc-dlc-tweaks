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
}