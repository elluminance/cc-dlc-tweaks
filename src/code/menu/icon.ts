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

let fontMappings: ig.MultiFont.Mapping = {
    "item-toggle-scale":  [fontIndex, 0],
    "el-rainbow-text":    [fontIndex, 1],
    "el-gem-credits":     [fontIndex, 2],
    "class-triblader":    [fontIndex, 3],
    "class-quadroguard":  [fontIndex, 4],
    "class-pentafist":    [fontIndex, 5],
    "class-hexacast":     [fontIndex, 6],
    "class-spheromancer": [fontIndex, 7],

    "stat-el-risktaker": [fontIndex+1, 0],
    "stat-aiming-speed": [fontIndex+1, 1],
    "stat-el-overheal":  [fontIndex+1, 2],
    "stat-el-neutral-boost": [fontIndex+1, 3],
    "stat-el-heat-boost": [fontIndex+1, 4],
    "stat-el-cold-boost": [fontIndex+1, 5],
    "stat-el-shock-boost": [fontIndex+1, 6],
    "stat-el-wave-boost": [fontIndex+1, 7],
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