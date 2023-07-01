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
            rankLabel: string;
            pointMultiplier: number;
            expMultiplier: number;
            penaltyMultiplier: number;
        }
        let GAUNTLET_RANKS: GauntletRank[];

        enum GAUNTLET_MSG {
            RANK_CHANGED,
            ROUND_STARTED,
            LEVEL_CHANGED,
            EXP_CHANGED,
        }


        namespace GauntletController {
            interface StepData {
                //currentStep?: el.GauntletStep;
                callstack: el.GauntletStep[];
                
            }

            interface Runtime {
                currentCup: Optional<GauntletCup>;
                
                currentRound: number;
                steps: StepData;
                //currentRoundStep?: GauntletStep | null;
                roundEnemiesDefeated: number;
                roundEnemiesGoal: number;
                gauntletStarted: boolean;

                curPoints: number;
                totalPoints: number;
                curXp: number;
                curLevel: number;

                playerStatOverride: Optional<el.StatOverride>;
                partyStatOverrides: Optional<Record<string, el.StatOverride>>;
                
                combatRankLevel: number;
                combatRankProgress: number;
                combatRankTimer: number;

                statIncrease: GauntletCup.StatIncrease
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

            interface LevelUpScaleTypeKeys {
                NONE: never;
                LINEAR: never;

                PARTY: never;
            }
            type LevelUpScaleType = keyof LevelUpScaleTypeKeys;

            interface LevelUpTypeKeys {
                statUp: never;
                modifier: never;
                heal: never;
                addPartyMember: never;
                item: never;
            }

            type LevelUpType = keyof LevelUpTypeKeys;

            interface Replacement {
                original: string;
                replacement: sc.TextLike;
            } 

            interface LevelUpOption {
                type: LevelUpType;
                icon: ig.Image;
                iconIndex: number;
                cost: number;
                key: string;
                condition?: ig.VarCondition,

                repeat?: number | boolean;
                scaleType?: LevelUpScaleType;
                
                value?: number;
                statType?: keyof sc.CombatParams.BaseParams | keyof sc.MODIFIERS;
                element?: keyof sc.ELEMENT | "ALL";
                partyMemberName?: string;
                itemID?: sc.ItemID;

                name?: string | ig.LangLabel.Data;
                shortDesc?: string | ig.LangLabel.Data;
                descReplace?: Replacement[];
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

            registerCup(this: this, name: string | string[]): void;

            enterGauntletMode(this: this, name: string): void;
            beginGauntlet(this: this): void;
            startNextRound(this: this): void;
            spawnEnemy(
                this: this,
                enemyEntry: GauntletController.EnemyEntry,
                baseLevel: number, 
                showEffect?: boolean,
            ): ig.ENTITY.Enemy;
            addGui(this: this): void;
            addPoints(this: this, score: number): void;
            addPartyMember(this: this, member: string): void;

            addExp(this: this, exp: number): void;
            processLevel(this: this): void;
            applyLevelUpBonus(this: this, option: GauntletController.LevelUpOption): void;
            getLevelOptionName(this: this, option: GauntletController.LevelUpOption): string;
            getLevelOptionDesc(this: this, option: GauntletController.LevelUpOption): string;
            getLevelOptionCost(this: this, option: GauntletController.LevelUpOption): number;
            getLevelOptionTypeName(this: this, option: GauntletController.LevelUpOption): string;

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
            _getEnemyType(this: this, enemyType: string): GauntletCup.EnemyType;
            
            stashPartyMembers(this: this): void;
            unstashPartyMembers(this: this): void;
            getRoundEnemiesDefeated(this: this): number;

            _getRank(this: this): el.GauntletRank;
            getRankLabel(this: this): string;
            getRankProgress(this: this): number;
            getRankPointMultiplier(this: this): number;
            getRankExpMultiplier(this: this): number;
            getRankPenalty(this: this): number;
            isRankDecaying(this: this): boolean;
            isSRank(this: this): boolean;
            addRank(this: this, value: number, applyPenalty?: boolean): boolean;
        }
        let GauntletController: GauntletController.Constructor;
        let gauntlet: GauntletController;

        let DEFAULT_GAUNTLET_LEVEL_UP_OPTIONS: Record<string, GauntletController.LevelUpOption>;

        namespace GauntletCup {
            interface Constructor extends ImpactClass<GauntletCup> {
                new (name: string): GauntletCup;

                DefaultLevelUpOptions: Record<string, LevelUpOptionList>;
            }

            interface EnemyType {
                enemyInfo: sc.EnemyInfo;
                xp: number;
                buff: sc.StatChange;
                effect?: Optional<ig.EffectHandle>;
                levelOffset: number;
                pointMultiplier: number
            }

            interface EnemyInfoData {
                settings: sc.EnemyInfo.Settings;
                xp: number;
                buff?: Partial<sc.StatChange.Params>;
                effect?: ig.EffectHandle.Settings;
                levelOffset?: number;
                pointMultiplier?: number;
            }

            interface FunctionEntry {
                steps: GauntletStepBase.Settings[];
            }

            interface Data {
                name: ig.LangLabel.Data;
                description: ig.LangLabel.Data;
                condition?: string;

                map: string;
                marker?: string;
                
                enemyTypes: Record<string, EnemyInfoData>;
                roundSteps: GauntletStepBase.Settings[];
                functions?: Record<string, FunctionEntry>;
                playerStats: StatOverride.OverrideEntry;
                statIncrease: StatIncrease;
            }

            type StatIncrease = Required<el.StatOverride.StatModification>;

            interface LevelUpEntry {
                type: GauntletController.LevelUpType;
                iconSrc: string;
                iconIndex: number;
                cost: number;
                condition?: ig.VarCondition,

                repeat?: number | boolean;
                scaleType?: GauntletController.LevelUpScaleType;
                
                value?: number;
                statType?: keyof sc.CombatParams.BaseParams | keyof sc.MODIFIERS;
                element?: keyof sc.ELEMENT | "ALL";
                partyMemberName?: string;
                itemID?: sc.ItemID;
            }

            type LevelUpOptionList = Record<string, GauntletController.LevelUpOption>;
        }
        interface GauntletCup extends ig.JsonLoadable {
            data: GauntletCup.Data;
            
            enemyTypes: Record<string, GauntletCup.EnemyType>;
            name: string;
            desc: string;
            condition: ig.VarCondition;
            roundSteps: GauntletStep[];
            functions: Record<string, GauntletFunction>
            playerStats: StatOverride.OverrideEntry;
            statIncrease: GauntletCup.StatIncrease;

            levelUpOptions: GauntletCup.LevelUpOptionList;

            map: string;
            marker?: string;
            numRounds: number;

            getName(this: this): string;
            onload(this: this, data: GauntletCup.Data): void;
        }
        let GauntletCup: GauntletCup.Constructor;
    }
}