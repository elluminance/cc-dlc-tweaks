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
                roundEnemiesDefeated: number;
                roundEnemiesGoal: number;

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

            
        }
        interface GauntletController extends ig.GameAddon, ig.Vars.Accessor {
            runtime: GauntletController.Runtime;
            active: boolean;
            cups: Record<string, el.GauntletCup>
            storedPartyBehavior: keyof sc.PARTY_STRATEGY.BehaviourStrategies;
            partyStash: string[];
            roundGui?: ig.GUI.CounterHud;
            scoreGui?: ig.GUI.ScoreHud;
            //timerGui: ????

            registerCup(this: this, name: string | string[]): void;

            startGauntlet(this: this, name: string): void;
            startNextRound(this: this): void;
            checkForNextRound(this: this): void;
            _spawnEnemy(
                this: this,
                enemyInfo: sc.EnemyInfo,
                marker: GauntletCup.LocationData,
                level: number,
                showEffect?: boolean,
            ): void;
            addGui(this: this): void;

            onCombatantDeathHit(this: this, attacker: ig.ENTITY.Combatant, victim: ig.ENTITY.Combatant): void;

            addScore(this: this, score: number): void;

            stashPartyMembers(this: this): void;
            unstashPartyMembers(this: this): void;
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

            interface LocationData {
                marker: string;
                offX?: number;
                offY?: number;
                offZ?: number;
            }
            interface EnemyEntry {
                type: string;
                pos: LocationData;
            }
            interface Round {
                level: number;
                enemies: EnemyEntry[];
            }

            interface Data {
                name: ig.LangLabel.Data;
                description: ig.LangLabel.Data;
                condition?: string;

                enemyTypes: Record<string, EnemyInfoData>;
                rounds: GauntletCup.Round[];
                playerStats: StatOverride.OverrideEntry;
            }
        }
        interface GauntletCup extends ig.JsonLoadable {
            data: GauntletCup.Data;
            
            enemyTypes: Record<string, GauntletCup.EnemyType>;
            name: string;
            desc: string;
            condition: ig.VarCondition;
            rounds: GauntletCup.Round[];
            playerStats: StatOverride.OverrideEntry;

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

            interface OverrideEntry {
                hp: number;
                attack: number;
                defense: number;
                focus: number;
                modifiers?: Partial<Record<keyof sc.MODIFIERS, number>>;
                spLevel?: number;
            }
        }

        interface StatOverride extends ig.Class {
            root: sc.PlayerModel;
            hp: number;
            attack: number;
            defense: number;
            focus: number;
            modifiers: Partial<Record<keyof sc.MODIFIERS, number>>;
            spLevel?: number;

            elementBonus: Record<keyof typeof sc.ELEMENT, StatOverride.ElementBonus>;

            active: boolean;

            setActive(this: this, state: boolean): void;
            applyOverride(this: this, override: StatOverride.OverrideEntry): void;
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
            interface EL_ENABLE_STAT_OVERRIDE extends ig.EventStepBase {
                state: boolean;
            }
            let EL_ENABLE_STAT_OVERRIDE: EL_ENABLE_STAT_OVERRIDE.Constructor;

            namespace START_EL_GAUNTLET {
                interface Constructor extends ImpactClass<START_EL_GAUNTLET> {}
            }
            interface START_EL_GAUNTLET extends ig.EventStepBase {}
            let START_EL_GAUNTLET: START_EL_GAUNTLET.Constructor;
        }
    }
    
}