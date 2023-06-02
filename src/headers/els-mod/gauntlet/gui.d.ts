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
            active: boolean;

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
    }
}