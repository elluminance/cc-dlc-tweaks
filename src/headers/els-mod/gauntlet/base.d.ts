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
            UPGRADE_PURCHASED,
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
                
                combatRankLevel: number;
                combatRankProgress: number;
                combatRankTimer: number;

                statIncrease: GauntletCup.StatIncrease;
                levelDiff: number;
                selectedBonuses: Record<string, number>;
                partySelected: number;
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

            interface BonusScaleTypeKeys {
                NONE: never;
                LINEAR: never;

                PARTY: never;
            }
            type BonusScaleType = keyof BonusScaleTypeKeys;

            interface BonusTypeKeys {
                statUp: never;
                statLevelUp: never;
                modifier: never;
                heal: never;
                addPartyMember: never;
                item: never;
                special: never;
            }

            type BonusType = keyof BonusTypeKeys;

            interface Replacement {
                original: string;
                replacement: sc.TextLike;
            } 

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type SpecialFuncParams = Record<string, any>;
            type SpecialFunc = (params: SpecialFuncParams, option: BonusOption, runtime: Runtime) => void;

            interface BaseBonusEntry {
                type: BonusType;
                iconSrc: string;
                iconIndexX: number;
                iconIndexY: number;
                cost: number;
                weight: number;

                mutuallyExclusive?: string[];
                requires?: string[];
                //this will be used 
                generalKey?: string;
                
                condition?: string;
                minLevel?: number;
                specialFunc?: string;
                specialFuncParams?: SpecialFuncParams;


                repeat?: number | boolean;
                scaleType?: BonusScaleType;
                scaleFactor?: number;

                value?: number;
                absolute?: boolean;
                statType?: keyof sc.CombatParams.BaseParams | keyof sc.MODIFIERS | "maxSp";
                element?: keyof typeof sc.ELEMENT | "ALL";
                partyMemberName?: string;
                itemID?: sc.ItemID;

                name?: string | ig.LangLabel.Data;
                shortDesc?: string | ig.LangLabel.Data;
                descReplace?: Replacement[];
            }

            interface BonusOption extends Omit<BaseBonusEntry, "condition"> {
                icon: ig.Image;
                key: string;
                condition?: ig.VarCondition,

            }

            interface Constructor extends ImpactClass<GauntletController> {
                new(): GauntletController;
            }
        }

        let GAUNTLET_SPECIAL_BONUS_FUNC: Record<string, GauntletController.SpecialFunc>;

        interface GauntletController extends ig.GameAddon, ig.Vars.Accessor, sc.Model {
            runtime: GauntletController.Runtime;
            active: boolean;
            cups: Record<string, el.GauntletCup>
            storedPartyBehavior: keyof sc.PARTY_STRATEGY.BehaviourStrategies;
            partyStash: string[];
            levelUpGui: el.GauntletBonusGui;
            roundGui?: ig.GUI.CounterHud;
            scoreGui?: ig.GUI.ScoreHud;
            pauseExecution: boolean;
            bonusEvent: ig.Event;
            numBonusOptions: number;

            categoryColorCodes: PartialRecord<GauntletController.BonusType, string>;

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

            startTimer(this: this): void;
            pauseTimer(this: this): void;

            addExp(this: this, exp: number): void;
            processLevel(this: this): boolean;
            applyLevelUpBonus(this: this, option: GauntletController.BonusOption): void;
            getBonusOptionName(this: this, option: GauntletController.BonusOption): string;
            getBonusOptionDesc(this: this, option: GauntletController.BonusOption): string;
            getBonusOptionCost(this: this, option: GauntletController.BonusOption): number;
            getBonusOptionTypeName(this: this, option: GauntletController.BonusOption): string;
            purchaseBonusOption(this: this, option: GauntletController.BonusOption): boolean;

            generateBonusOptions(this: this): GauntletController.BonusOption[];
            showBonusGui(this: this): void;
            onBonusGuiClose(this: this): void;

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

        namespace GauntletCup {
            interface Constructor extends ImpactClass<GauntletCup> {
                new (name: string): GauntletCup;

                DefaultBonusOptions: Record<string, Record<string, BonusEntry>>;
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

            type BonusEntry = GauntletController.BaseBonusEntry;
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

            bonusOptions: Record<string, GauntletController.BonusOption>;

            map: string;
            marker?: string;
            numRounds: number;

            getName(this: this): string;
            onload(this: this, data: GauntletCup.Data): void;
        }
        let GauntletCup: GauntletCup.Constructor;
    }
}