import gui from "./gui.js"

export default function() {
    gui()

    sc.EL_GEM_COLOR = {
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
        ONXY: 11,
    }

    const GUI_IMAGE = new ig.Image("media/gui/el-mod-gui.png")
    sc.EL_GemHelper = {
        gemColorToIcon: {
            [sc.EL_GEM_COLOR.DEFAULT]: "\\i[el-gem-default]",
            [sc.EL_GEM_COLOR.RUBY]: "\\i[el-gem-ruby]",
            [sc.EL_GEM_COLOR.GARNET]: "\\i[el-gem-garnet]",
            [sc.EL_GEM_COLOR.DIAMOND]: "\\i[el-gem-diamond]",
            [sc.EL_GEM_COLOR.MOONSTONE]: "\\i[el-gem-moonstone]",
            [sc.EL_GEM_COLOR.CITRINE]: "\\i[el-gem-citrine]",
            [sc.EL_GEM_COLOR.TOPAZ]: "\\i[el-gem-topaz]",
            [sc.EL_GEM_COLOR.AMETHYST]: "\\i[el-gem-amethyst]",
            [sc.EL_GEM_COLOR.EMERALD]: "\\i[el-gem-emerald]",
            [sc.EL_GEM_COLOR.LAPIS_LAZULI]: "\\i[el-gem-lapis-lazuli]",
            [sc.EL_GEM_COLOR.AQUAMARINE]: "\\i[el-gem-aquamarine]",
            [sc.EL_GEM_COLOR.ONXY]: "\\i[el-gem-onyx]",
        },

        drawGemLevel(level, height) {
            GUI_IMAGE.draw(6, height - 7, 23 + 8 * (level - 1), 0, 7, 5)
        }
    }
}