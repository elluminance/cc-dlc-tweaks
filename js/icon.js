const ascBoosterIcons = new ig.Font("media/font/el-ascended-booster.png", 16, ig.MultiFont.ICON_START);

const fontIndex = sc.fontsystem.font.iconSets.length;
sc.fontsystem.font.pushIconSet(ascBoosterIcons)

sc.fontsystem.font.setMapping({
    "item-toggle-scale": [fontIndex, 0]
})