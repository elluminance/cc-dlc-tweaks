export {};

declare global {
    namespace sc {
        interface PlayerModel {
            el_statOverride: el.StatOverride;

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
                currentCup: GauntletCup | null;
                currentRound: number;
                curPoints: number;
                totalPoints: number;
                curXp: number;
            }

            interface Constructor extends ImpactClass<GauntletController> {
                new(): GauntletController;
            }

            interface EnemyData {
                type: string
            }

            interface LocationData {
                marker: string;
                offX: number;
                offY: number;
                offZ: number;
            }
        }
        interface GauntletController extends ig.GameAddon {
            runtime: GauntletController.Runtime;
            active: boolean;
            cups: Record<string, el.GauntletCup>

            startGauntlet(this: this, name: string): void;
            startNextRound(this: this): void;
            registerCup(this: this, name: string | string[]): void;
            _spawnEnemy(
                this: this,
                enemySettings: sc.EnemyInfo.Settings,
                marker: GauntletController.LocationData,
                level: number,
                showEffect?: boolean,
            ): void;
        }
        let GauntletController: GauntletController.Constructor;
        let gauntlet: GauntletController;

        namespace GauntletCup {
            interface Constructor extends ImpactClass<GauntletCup> {
                new (name: string): GauntletCup;
            }

            interface EnemyType {
                enemyInfo: sc.EnemyInfo;
            }

            interface EnemyInfoData {
                settings: sc.EnemyInfo.Settings;
            }

            interface Data {
                name: ig.LangLabel.Data;
                description: ig.LangLabel.Data;
                condition?: string;

                enemyTypes: Record<string, EnemyInfoData>;
            }
        }
        interface GauntletCup extends ig.JsonLoadable {
            data: GauntletCup.Data;
            
            enemyTypes: Record<string, GauntletCup.EnemyType>;
            name: string;
            desc: string;
            condition: ig.VarCondition;

            getName(this: this): string;
            onload(this: this, data: GauntletCup.Data): void;
        }
        let GauntletCup: GauntletCup.Constructor;

        //#region stat override
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
        //#endregion


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