el.GauntletLevelUpGui = sc.ModalButtonInteract.extend({
    levelUpChoices: [],
    done: false,
    
    init() {
        this.parent(
            ig.lang.get("sc.gui.el-gauntlet.levelUp.title"),
            null,
            [ig.lang.get("sc.gui.el-gauntlet.levelUp.skip")],
            this.onClick.bind(this)
        )
        this.keepOpen = true;
        this.content.setSize(270, 250);
        this.msgBox.resize();
        
        let offset = 24;
        for(let i = 0; i < 4; i++) {
            let button = new el.GauntletLevelUpGui.LevelUpEntry;
            button.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
            button.setPos(0, offset);
            offset += button.hook.size.y + 4;

            this.levelUpChoices.push(button);
            this.buttongroup.addFocusGui(button);
            this.content.addChildGui(button);
        }
    },
    
    show() {
        this.done = false;
        this.setOptions(el.gauntlet.generateLevelUpOptions());
        this.parent();
        for(let i of this.levelUpChoices) {
            i.show();
        }
    },

    setOptions(options) {
        for(let i = 0; i < 4; i++) {
            this.levelUpChoices[i].updateInfo(options[i]);
        }
    },

    onClick(button) {
        if(button instanceof el.GauntletLevelUpGui.LevelUpEntry) {
            if(el.gauntlet.purchaseLevelOption(button.levelOption!)) {
                sc.BUTTON_SOUND.submit.play();
                button.updateInfo(null)
                this.buttons[0].setText(ig.lang.get("sc.gui.el-gauntlet.levelUp.close"));
                this.hasPurchased = true;
            } else sc.BUTTON_SOUND.denied.play();
        } else {
            if(this.hasPurchased) {
                this.hide();
            } else {
                sc.Dialogs.showYesNoDialog(
                    ig.lang.get("sc.gui.el-gauntlet.levelUp.skipConfirm"),
                    null, //icon
                    button => {
                        if(button.data === 0) {
                            this.hide();
                        }
                    }
                )
            }
        }
    },

    onBackButtonCheck() {
        return false;
    },

    hide() {
        this.done = true;
        this.parent();
        for(let i of this.levelUpChoices) {
            i.hide();
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

const enum BUTTON_STATE {
    INACTIVE = 0,
    ACTIVE = 1,
    CANT_AFFORD = 2,
}

el.GauntletLevelUpGui.LevelUpEntry = ig.FocusGui.extend({
    data: {},
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
            },
            inactive_cost: {
                x: 96,
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

    init() {
        this.parent(true);

        this.setSize(270, 40);
        this.titleText = new sc.TextGui("");
        this.titleText.setPos(30, 0);
        this.addChildGui(this.titleText);

        this.shortDescText = new sc.TextGui("", {
            font: sc.fontsystem.smallFont,
        });
        this.shortDescText.setPos(30, 14);
        this.shortDescText.setMaxWidth(225);
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

        //this.updateInfo();
    },

    updateInfo(option) {
        if(option !== undefined) this.levelOption = option;

        if(this.levelOption) {
            let cost = el.gauntlet.getLevelOptionCost(this.levelOption);
            let canAfford = true;
            if(cost > el.gauntlet.runtime.curPoints) {
                this.active = false;
                this.buttonState = BUTTON_STATE.CANT_AFFORD;
                canAfford = false;
            } else {
                this.active = true;
                this.buttonState = BUTTON_STATE.ACTIVE;
            }

            this.icon = this.levelOption.icon;
            const size = Math.floor(this.icon.width / 20);
            this.iconOffX = 20 * (this.levelOption.iconIndex % size);
            this.iconOffY = 20 * Math.floor(this.levelOption.iconIndex / size);
            
            this.titleText.setText((!canAfford ? "\\C[gray]" : "") + el.gauntlet.getLevelOptionName(this.levelOption));
            this.shortDescText.setText(el.gauntlet.getLevelOptionDesc(this.levelOption));
            this.costText.setText(
                (!canAfford ? "\\C[red]" : "") +
                ig.lang.get("sc.gui.el-gauntlet.levelUp.cost")
                    .replace("[!]", cost.toString())
            );
            this.upgradeTypeText.setText(el.gauntlet.getLevelOptionTypeName(this.levelOption));
        } else {
            this.active = false;
            this.buttonState = BUTTON_STATE.INACTIVE;

            this.titleText.setText("");
            this.shortDescText.setText("");
            this.costText.setText("");
            this.upgradeTypeText.setText("");
        }
    },

    updateDrawables(renderer) {
        let state;

        switch(this.buttonState) {
            case BUTTON_STATE.ACTIVE:
                state = this.focus ? "focus" : "default";
                break;
            case BUTTON_STATE.CANT_AFFORD:
                state = "inactive_cost";
                break;
            case BUTTON_STATE.INACTIVE:
            default:
                state = "inactive";
                break;
        }

        this.ninepatch.draw(
            renderer,
            this.hook.size.x, this.hook.size.y,
            state
        );

        if(this.levelOption) {
            //main icon
            renderer.addGfx(this.icon, 4, 10, this.iconOffX, this.iconOffY, 20, 20);
            //element icon
            if(this.levelOption.element !== undefined) renderer.addGfx(this.gfx, 18, 24, 132 + 6 * (this.levelOption.element as unknown as number), 131, 5, 5);
        }
    },

    show() {
        sc.Model.addObserver(el.gauntlet, this)
    },
    hide() {
        sc.Model.removeObserver(el.gauntlet, this);
    },

    modelChanged(model, message) {
        if(model === el.gauntlet) {
            switch(message) {
                case el.GAUNTLET_MSG.UPGRADE_PURCHASED:
                    this.updateInfo();
                    break;
            }
        }
    },
})