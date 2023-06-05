import "./gui";
import "./stat-override";
import "./steps";

export {};

declare global {
    namespace ig.ENTITY {
        interface Enemy {
            el_gauntletEnemyInfo: el.GauntletCup.EnemyType
        }
    }
    namespace el {
        interface GauntletRank {
            expBonus: number;
            rankLabel: string;
            penaltyMultiplier: number;
        }
        let GAUNTLET_RANKS: GauntletRank[];

        enum GAUNTLET_MSG {
            RANK_CHANGED,
            ROUND_STARTED,
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

                combatRankLevel: number;
                combatRankProgress: number;
                combatRankTimer: number;
            }

            interface Constructor extends ImpactClass<GauntletController> {
                new(): GauntletController;
            }
            
        }
        interface GauntletController extends ig.GameAddon, ig.Vars.Accessor, sc.Model {
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
            ): ig.ENTITY.Enemy;
            addGui(this: this): void;
            addScore(this: this, score: number): void;

            onCombatantDeathHit(this: this, attacker: ig.ENTITY.Combatant, victim: ig.ENTITY.Combatant): void;
            onGuardCounter(this: this, enemy: ig.ENTITY.Enemy): void;
            onEnemyBreak(this: this, enemy: ig.ENTITY.Enemy): void;
            onEnemyDamage(
                this: this,
                combatant: ig.ENTITY.Enemy,
                damageResult: sc.CombatParams.DamageResult
            ): void;
            onPlayerDamage(
                this: this,
                combatant: ig.ENTITY.Player,
                damageResult: sc.CombatParams.DamageResult,
                shieldResult: sc.SHIELD_RESULT,
            ): void;

            stashPartyMembers(this: this): void;
            unstashPartyMembers(this: this): void;

            _getRank(this: this): el.GauntletRank;
            getRankLabel(this: this): string;
            getRankProgress(this: this): number;
            getRankMultiplier(this: this): number;
            getRankPenalty(this: this): number;
            isRankDecaying(this: this): boolean;
            isSRank(this: this): boolean;
            addRank(this: this, value: number, applyPenalty?: boolean): boolean;
        }
        let GauntletController: GauntletController.Constructor;
        let gauntlet: GauntletController;

        namespace GauntletCup {
            interface Constructor extends ImpactClass<GauntletCup> {
                new (name: string): GauntletCup;
            }

            interface EnemyType {
                enemyInfo: sc.EnemyInfo;
                xp: number;
                buff: sc.StatChange;
                levelOffset: number;
                pointMultiplier: number
            }

            interface EnemyInfoData {
                settings: sc.EnemyInfo.Settings;
                xp: number;
                buff?: Partial<sc.StatChange.Params>;
                levelOffset?: number;
                pointMultiplier?: number;
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
    }
}