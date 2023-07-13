export {};

declare global {
    namespace sc {
        interface HpHudGui {
            el_GauntletXp: el.GauntletXpBar;
        }

        namespace CombatUpperHud {
            interface Sub {
                elGauntlet: el.GauntletCombatUpperHud;
            }
        }

        interface CombatUpperHud {
            showGauntletHud(this: this): void;
        }
    }

    namespace el {
        namespace GauntletXpBar {
            interface Constructor extends ImpactClass<GauntletXpBar> {
                new(): el.GauntletXpBar;
            }
        }
        interface GauntletXpBar extends ig.GuiElementBase {
            gfx: ig.Image;
            curVal: number;
            blinkTimer: number;

            updateVal(this: this): void;
        }
        
        let GauntletXpBar: GauntletXpBar.Constructor;

        namespace GauntletCombatUpperHud {
            interface Constructor extends ImpactClass<GauntletCombatUpperHud> {
                new (): GauntletCombatUpperHud;
            }
        }
        interface GauntletCombatUpperHud extends ig.GuiElementBase, sc.Model.Observer, sc.CombatUpperHud.ContentGui {
            gfx: ig.Image;
            rankLabel: sc.TextGui;
            rankValue: sc.TextGui;
            progress: number;
            blinkTimer: number;

            start(this: this): void;
            end(this: this): void;
        }
        let GauntletCombatUpperHud: GauntletCombatUpperHud.Constructor;

        namespace GauntletExpEntry {
            interface Constructor extends ImpactClass<GauntletExpEntry> {
                new (withLabel: boolean, exp?: number): GauntletExpEntry; 
            }
        }
        interface GauntletExpEntry extends sc.ExpEntryGui {}
        let GauntletExpEntry: GauntletExpEntry.Constructor;


        namespace GauntletExpHud {
            interface Constructor extends ImpactClass<GauntletExpHud> {
                new(): GauntletExpHud;
            }
        }
        interface GauntletExpHud extends sc.ExpHudGui {

        }
        let GauntletExpHud: GauntletExpHud.Constructor;


        namespace GauntletBonusGui {
            interface Constructor extends ImpactClass<GauntletBonusGui> {
                new (numButtons: number): GauntletBonusGui;

                BonusEntry: BonusEntry.Constructor;
            }

            namespace BonusEntry {
                interface Constructor extends ImpactClass<BonusEntry> {
                    new (): BonusEntry;
                }
            }

            

            interface BonusEntry extends ig.FocusGui, sc.Model.Observer {
                data: Record<string, never>;
                gfx: ig.Image;
                ninepatch: ig.NinePatch;
                bonusOption?: Optional<el.GauntletController.BonusOption>;
                buttonState: number;

                icon: ig.Image;
                iconOffX: number;
                iconOffY: number;
                titleText: sc.TextGui;
                shortDescText: sc.TextGui;
                upgradeTypeText: sc.TextGui;
                costText: sc.TextGui;
                
                updateInfo(this: this, option?: Optional<el.GauntletController.BonusOption>): void;
                show(this: this): void;
                hide(this: this): void;
            }
        }
        interface GauntletBonusGui extends sc.ModalButtonInteract {
            bonusChoices: el.GauntletBonusGui.BonusEntry[];
            done: boolean;
            hasPurchased: boolean;
            
            onClick(this: this, button: ig.FocusGui): void;
            setOptions(this: this, options: el.GauntletController.BonusOption[]): void;
        }
        let GauntletLevelUpGui: GauntletBonusGui.Constructor;

        namespace GauntletFoodIcon {
            interface Constructor extends ImpactClass<GauntletFoodIcon> {
                new (foodName: string): GauntletFoodIcon;
            }
        }
        interface GauntletFoodIcon extends ig.Image {
            foodtilesheet: ig.TileSheet;
            index: number;

            getCacheKey(foodName: string): string;
        }
        let GauntletFoodIcon: GauntletFoodIcon.Constructor;
    }
}