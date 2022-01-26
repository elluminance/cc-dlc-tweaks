const icons = new ig.Font("media/font/els-mod-icons.png", 16, ig.MultiFont.ICON_START);
const buffIcons = new ig.Font("media/font/icons-buff-el-mod.png", 8, ig.MultiFont.ICON_START);
const buffIconsLarge = new ig.Font("media/font/icons-buff-large-el-mod.png", 16, ig.MultiFont.ICON_START);

const fontIndex = sc.fontsystem.font.iconSets.length;
const tinyFontIndex = sc.fontsystem.tinyFont.iconSets.length;
sc.fontsystem.font.pushIconSet(icons);
sc.fontsystem.font.pushIconSet(buffIconsLarge);

sc.fontsystem.tinyFont.pushIconSet(buffIcons);

sc.fontsystem.font.setMapping({
    "item-toggle-scale": [fontIndex, 0],
    "el-rainbow-text": [fontIndex, 1],
    "el-gem-credits": [fontIndex, 2],
    "class-triblader": [fontIndex, 3],
    "class-quadroguard": [fontIndex, 4],
    "class-pentafist": [fontIndex, 5],
    "class-hexacast": [fontIndex, 6],
    "class-spheromancer": [fontIndex, 7],

    "stat-el-risktaker": [fontIndex+1, 0]
})

sc.fontsystem.tinyFont.setMapping({
    "stat-el-risktaker": [tinyFontIndex, 0]
})
