el.GauntletLevelUpGui = sc.ModalButtonInteract.extend({
    init() {
        this.parent(
            "",
            null,
            ["Skip"],
            this.onClick.bind(this)
        )
        this.keepOpen = true;
        this.content.setSize(270, 250);
        this.msgBox.resize();
    },
    
    show() {
        this.parent();
        let offset = 24;
        for(let option of [
            el.GauntletCup.DefaultLevelUpOptions.PARTY.PARTY_EMILIE,
            el.GauntletCup.DefaultLevelUpOptions.PARTY.PARTY_CTRON,
            el.GauntletCup.DefaultLevelUpOptions.PARTY.PARTY_APOLLO,
            el.GauntletCup.DefaultLevelUpOptions.HEALING.HEAL_20,
        ]) {
            //@ts-ignore
            let button = new el.GauntletLevelUpGui.LevelUpEntry(option);
            button.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
            button.setPos(0, offset);
            offset += button.hook.size.y + 4;
            this.buttongroup.addFocusGui(button);

            this.content.addChildGui(button)
        }
    },

    onClick(button) {
        if(button instanceof el.GauntletLevelUpGui.LevelUpEntry) {
            el.gauntlet.applyLevelUpBonus(button.levelOption);

            this.hide();
        } else {
            this.hide();
        }
    },
})

//rough idea for type colors:
// +stat: green
// +modifier: yellow
// heal or similar: blue
// party member: purple
// buy item: orange
// other: pink OR red 

el.GauntletLevelUpGui.LevelUpEntry = ig.FocusGui.extend({

    gfx: new ig.Image("media/gui/el-mod-gui.png"),

    ninepatch: new ig.NinePatch("media/gui/el-mod-gui.png", {
        top: 18,
        height: 10,
        bottom: 8,

        left: 8,
        width: 16,
        right: 8,

        offsets: {
            default: {
                x: 0,
                y: 106
            },
            focus: {
                x: 32,
                y: 106
            },
            inactive: {
                x: 64,
                y: 106
            }
        }
    }),

    icon: null,
    iconOffX: 0,
    iconOffY: 0,
    titleText: null,
    shortDescText: null,
    upgradeTypeText: null,
    costText: null,

    init(option) {
        this.parent(true);
        this.levelOption = option;

        this.setSize(270, 40);
        this.titleText = new sc.TextGui("");
        this.titleText.setPos(30, 0);
        this.addChildGui(this.titleText);

        this.shortDescText = new sc.TextGui("", {
            font: sc.fontsystem.smallFont,
        });
        this.shortDescText.setPos(30, 14);
        this.shortDescText.setMaxWidth(240);
        this.addChildGui(this.shortDescText);

        this.costText = new sc.TextGui("", {
            font: sc.fontsystem.smallFont
        });
        this.costText.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_TOP);
        this.costText.setPos(3, 2);
        this.addChildGui(this.costText);

        this.upgradeTypeText = new sc.TextGui("", {
            font: sc.fontsystem.smallFont
        });
        this.upgradeTypeText.setAlign(ig.GUI_ALIGN.X_RIGHT, ig.GUI_ALIGN.Y_BOTTOM);
        this.upgradeTypeText.setPos(3, 0);
        this.addChildGui(this.upgradeTypeText);

        //this.icon = new ig.Image("media/gui/gauntlet-icons/el-mod.png")
        this.updateInfo();
    },

    updateInfo() {
        let option = this.levelOption;
        this.icon = option.icon;
        const size = Math.floor(this.icon.width / 20);
        this.iconOffX = 20 * (option.iconIndex % size);
        this.iconOffY = 20 * Math.floor(option.iconIndex / size);
        
        this.titleText.setText(el.gauntlet.getLevelOptionName(option));
        this.shortDescText.setText(el.gauntlet.getLevelOptionDesc(option));
        this.costText.setText(
            ig.lang.get("sc.gui.el-gauntlet.levelUp.cost")
                .replace("[!]", el.gauntlet.getLevelOptionCost(option).toString())
        );
        this.upgradeTypeText.setText(el.gauntlet.getLevelOptionTypeName(option));
    },

    updateDrawables(renderer) {
        this.ninepatch.draw(
            renderer,
            this.hook.size.x, this.hook.size.y,
            this.active ? (this.focus ? "focus" : "default") : "inactive"
        );

        //main icon
        renderer.addGfx(this.icon, 4, 10, this.iconOffX, this.iconOffY, 20, 20);
        //element icon
        if(this.levelOption.element !== undefined) renderer.addGfx(this.gfx, 18, 24, 99 + 6 * (this.levelOption.element as unknown as number), 131, 5, 5);
    },
})