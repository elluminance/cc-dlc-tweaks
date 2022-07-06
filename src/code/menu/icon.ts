export default function() {
const icons = new ig.Font("media/font/els-mod-icons.png", 16, ig.MultiFont.ICON_START);

const buffIcons = new ig.Font("media/font/icons-buff-el-mod.png", 8, ig.MultiFont.ICON_START);
const buffIconsLarge = new ig.Font("media/font/icons-buff-large-el-mod.png", 16, ig.MultiFont.ICON_START);

const itemIcons = new ig.Font("media/font/el-mod-item-icons.png", 16, ig.MultiFont.ICON_START);


const fontIndex = sc.fontsystem.font.iconSets.length;
const tinyFontIndex = sc.fontsystem.tinyFont.iconSets.length;
sc.fontsystem.font.pushIconSet(icons);
sc.fontsystem.font.pushIconSet(buffIconsLarge);
sc.fontsystem.font.pushIconSet(itemIcons);

sc.fontsystem.tinyFont.pushIconSet(buffIcons);

const itemTypes = ["item-toggle", "item-circuit"]
const itemRarities = ["", "-normal", "-rare", "-legend", "-unique", "-backer", "-scale"]

let i = 0;

let fontMappings: ig.MultiFont.Mapping = {
    "el-rainbow-text":      [fontIndex, i++],
    "el-gem-credits":       [fontIndex, i++],
    "class-triblader":      [fontIndex, i++],
    "class-quadroguard":    [fontIndex, i++],
    "class-pentafist":      [fontIndex, i++],
    "class-hexacast":       [fontIndex, i++],
    "class-spheromancer":   [fontIndex, i++],

    "el-gem-blank-white":   [fontIndex, i++],
    "el-gem-ruby":          [fontIndex, i++],
    "el-gem-garnet":        [fontIndex, i++],
    "el-gem-diamond":       [fontIndex, i++],
    "el-gem-moonstone":     [fontIndex, i++],
    "el-gem-citrine":       [fontIndex, i++],
    "el-gem-topaz":         [fontIndex, i++],
    "el-gem-amethyst":      [fontIndex, i++],
    "el-gem-emerald":       [fontIndex, i++],
    "el-gem-lapis-lazuli":  [fontIndex, i++],
    "el-gem-aquamarine":    [fontIndex, i++],
    "el-gem-onyx":          [fontIndex, i++],
    "el-gem-default":       [fontIndex, i++],


    "stat-el-risktaker":    [fontIndex+1, i=0],
    "stat-aiming-speed":    [fontIndex+1, i++],
    "stat-el-overheal":     [fontIndex+1, i++],
    "stat-el-neutral-boost":[fontIndex+1, i++],
    "stat-el-heat-boost":   [fontIndex+1, i++],
    "stat-el-cold-boost":   [fontIndex+1, i++],
    "stat-el-shock-boost":  [fontIndex+1, i++],
    "stat-el-wave-boost":   [fontIndex+1, i++],
}

let index = 0;
itemTypes.forEach(itemType => {
    itemRarities.forEach(itemRarity => {
        fontMappings[`${itemType}${itemRarity}`] = [fontIndex + 2, index++];
    })
})

sc.fontsystem.font.setMapping(fontMappings)

sc.fontsystem.tinyFont.setMapping({
    "stat-el-risktaker": [tinyFontIndex, 0],
    "stat-aiming-speed": [tinyFontIndex, 1],
    "stat-el-overheal":  [tinyFontIndex, 2],
    "stat-el-neutral-boost": [tinyFontIndex, 3],
    "stat-el-heat-boost": [tinyFontIndex, 4],
    "stat-el-cold-boost": [tinyFontIndex, 5],
    "stat-el-shock-boost": [tinyFontIndex, 6],
    "stat-el-wave-boost": [tinyFontIndex, 7],
})

}