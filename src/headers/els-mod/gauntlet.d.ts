export {};

declare global {
    namespace sc {
        interface PlayerModel {
            el_statOverride: el.StatOverride;
            el_gauntletXp: number,

            el_enableStatOverride(this: this, active: boolean): void;
        }

        interface HpHudGui {
            el_GauntletXp: el.GauntletXpBar;
        }
    }

    namespace el {
        enum GAUNTLET_MESSAGE {
            CHANGED_STATE = 0,
        }

        namespace GauntletController {
            interface Runtime {
                curPoints: number;
                totalPoints: number;
                curXp: number;
            }

            interface Constructor extends ImpactClass<GauntletController> {
                new(): GauntletController;
            }
        }
        interface GauntletController extends ig.GameAddon {
            runtime: GauntletController.Runtime;
            active: boolean;

        }
        let GauntletController: GauntletController.Constructor;
        let gauntlet: GauntletController;

        namespace StatOverride {
            interface ElementBonus {
                hp: number;
                attack: number;
                defense: number;
                focus: number;
                modifiers: Partial<Record<keyof sc.MODIFIERS, number>>;
            }

            interface Constructor extends ImpactClass<StatOverride> {
                new (root: sc.PlayerModel): StatOverride;
            }
        }

        interface StatOverride extends ig.Class {
            root: sc.PlayerModel;
            hp: number;
            attack: number;
            defense: number;
            focus: number;
            modifiers: Partial<Record<keyof sc.MODIFIERS, number>>;
            spLevel: number;

            elementBonus: Record<keyof typeof sc.ELEMENT, StatOverride.ElementBonus>;

            active: boolean;

            setActive(this: this, state: boolean): void;
            setStat(this: this, stat: string, value: number): void;
            addStat(this: this, stat: string, value: number): void;
        }

        let StatOverride: StatOverride.Constructor;


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
    }

    namespace ig {
        namespace EVENT_STEP {
            namespace EL_ENABLE_STAT_OVERRIDE {
                interface Settings {
                    state: boolean;
                }
                interface Constructor extends ImpactClass<EL_ENABLE_STAT_OVERRIDE> {
                    new (settings: Settings): EL_ENABLE_STAT_OVERRIDE;
                }
            }
            interface EL_ENABLE_STAT_OVERRIDE extends ig.ActionStepBase {
                state: boolean;
            }
            let EL_ENABLE_STAT_OVERRIDE: EL_ENABLE_STAT_OVERRIDE.Constructor;
        }
    }
    
}