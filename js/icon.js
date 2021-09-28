const icons = new ig.Font("media/font/els-mod-icons.png", 16, ig.MultiFont.ICON_START);

const fontIndex = sc.fontsystem.font.iconSets.length;
sc.fontsystem.font.pushIconSet(icons)

sc.fontsystem.font.setMapping({
    "item-toggle-scale": [fontIndex, 0],
    "el-rainbow-text": [fontIndex, 1]
})