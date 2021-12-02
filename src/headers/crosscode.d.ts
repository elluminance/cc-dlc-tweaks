declare namespace Vec3 {
    function create(): Vec3
}

declare namespace ig {
    interface ActionConstructor {
        getVec3(a: Vec3, b: ig.ActorEntity, c: Vec3): Vec3
    }

    interface ActorEntity {
        getTarget(): ig.ActorEntity
    }

    interface Vars extends ig.Class {
        storage: {
            map: { [key: string]: any }
            maps: { [key: string]: any }
            tmp: { [key: string]: any }
            call: { [key: string]: any }
            session: {
                map: { [key: string]: any }
                maps: { [key: string]: any }
            }
            plot: {
                line: number
                [key: string]: any
            }
            [key: string]: any
        }

        init(this: this): void

        get(this: this, variable: string): any

        setDefault(this: this, variable: string, value: any): void
        set(this: this, variable: string, value: any): void
        add(this: this, variable: string, value: any): void
        sub(this: this, variable: string, value: any): void
        mul(this: this, variable: string, value: any): void
        div(this: this, variable: string, value: any): void
        mod(this: this, variable: string, value: any): void
        and(this: this, variable: string, value: any): void
        or(this: this, variable: string, value: any): void
        xor(this: this, variable: string, value: any): void
    }

    interface VarsConstructor extends ImpactClass<Vars> { }

    var vars: Vars
    var Vars: VarsConstructor

    interface ExtensionList extends SingleLoadable {

    }

    interface ExtensionManager {
        enabled: { [key: string]: boolean }
        init(this: this): void
    }

    interface ExtensionManagerConstructor extends ImpactClass<ExtensionManager> { }

    var ExtensionManager: ExtensionManagerConstructor
    var extensions: ExtensionManager

    interface System {
        ingameTick: number
    }

    namespace ENTITY {
        interface Player extends sc.PlayerBaseEntity {
            regenFactor: number
            updateModelStats(this: this, a: any): void
        }

        interface HitNumber extends sc.HitNumberEntityBase {
            spawnHealingNumber(this: this, pos: Vec3, entity: ig.Entity, healAmount: any): void
        }

        var HitNumber: HitNumber

        interface Enemy {
            boosterState: sc.ENEMY_BOOSTER_STATE
            enemyType: sc.EnemyInfo
            setLevelOverride(this: this, newLevel: number | null): void
        }

        interface Effect {
            target: any
            spriteFilter: any

            spawnParticle(this: this, a: ImpactClass<ig.Entity>, b: any, e: any, f?: any): void
        }
    }

    interface EffectStepBase extends Omit<StepBase, "start"> {
        particleData: EFFECT_ENTRY.EffectSettings

        start(this: this, entity: ig.ENTITY.Effect): void
    }
    type EffectStepBaseConstructor = StepBaseConstructor
    var EffectStepBase: EffectStepBaseConstructor

    namespace EFFECT_ENTRY {
        interface EffectSettings {
            particleDuration: number
            noLighter?: boolean,
            offset?: Vec3,
            fadeColor?: string | null
            colorAlpha?: number | null
            mode?: any
        }
    }

    interface Config extends ig.Class {
        _data: any,
        init(this: this, a: any): void
        copy(this: this): Config
    }

    interface ConfigConstructor extends ImpactClass<Config> { }

    interface EffectConfig extends ig.Config {
        init(this: this, c: any): void
    }

    interface EffectConfigConstructor extends ImpactClass<EffectConfig> {
        loadParticleData(this: this, a: any, b: ig.EFFECT_ENTRY.EffectSettings, d: any): ig.EFFECT_ENTRY.EffectSettings
    }

    var EffectConfig: EffectConfigConstructor
}

declare namespace sc {
    enum SHIELD_RESULT {
        NONE,
        REGULAR,
        PERFECT,
        NEUTRALIZE
    }

    enum COMBATANT_PARTY {
        PLAYER,
        ENEMY,
        OTHER
    }

    enum STATS_CATEGORY {
        GENERAL,
        COMBAT,
        ITEMS,
        QUESTS,
        EXPLORATION,
        MISC,
        LOG,
        ARENA
    }

    interface CrossCode {
        getEntityByName(this: this, name: string): ig.Entity
        getEntitiesByType(this: this, type: ImpactClass<ig.Entity>): ig.Entity[]
    }

    //#region Arena
    interface ArenaCupOptions {
        order?: number,
        id?: string
    }

    interface ArenaCup {
        order: number
    }

    interface Arena extends ig.GameAddon {
        active: boolean
        cups: { [key: string]: ArenaCup }

        init(this: this): void
        registerCup(this: this, a: string, b: ArenaCupOptions): void
        onPreDamageApply(this: this, a: any, b: any, c: any, d: any, e: any): void
        addScore(this: this, a: string, b: number): void
        getTotalArenaCompletion(this: this): number
        getCupCompletion(this: this, cupName: string): number
        getTotalDefaultTrophies(this: this, a: number, c: boolean): number
        getCupTrophy(this: this, a: string): number
        isCupUnlocked(this: this, a: string): boolean
        getTotalDefaultCups(this: this, sorted: boolean): { [key: string]: ArenaCup }
        isCupCustom(this: this, cupName: string): boolean
        isEnemyBlocked(this: this, a: any): boolean
    }

    interface ArenaConstructor extends ImpactClass<Arena> { }

    var Arena: ArenaConstructor
    var arena: Arena

    interface ArenaBonusObjective {
        _type: "Integer" | "EMPTY",
        _prefix?: "seconds" | "value" | "target"
        order: number,
        displayRangePoints: boolean,

        init(a: any, b: any): void
        check(a: any): boolean
        getText(a: string, b: any, c: boolean): string
        getPoints?(a: any, b: any): number
    }

    var ARENA_BONUS_OBJECTIVE: { [key: string]: ArenaBonusObjective }
    //#endregion Arena

    //#region Stats
    interface StatsModel extends ig.GameAddon {
        set(this: this, stat: string, value: number): void
        setMax(this: this, stat: string, value: number): void
        setMin(this: this, stat: string, value: number): void

        add(this: this, stat: string, value: number): void
        subtract(this: this, stat: string, value: number): void

        getMap(this: this, map: string, stat: string): number
        setMap(this: this, map: string, stat: string, value: number): void
        addMap(this: this, map: string, stat: string, value: number): void
        subMap(this: this, map: string, stat: string, value: number): void
    }
    var stats: StatsModel

    interface StatsModelConstructor extends ImpactClass<StatsModel> {
        new(): StatsModel
    }

    var StatsModel: StatsModelConstructor
    namespace Stats {
        type StatItemType = "Percent" | "Separator" | "Time" | "KeyValue" | "KeyCurMax" | "List" | "Logs"

        interface StatItem {
            type?: StatItemType
            subtype?: StatItemType
            displayName?: string
            highlight?: {
                min: number
            } | boolean
            group?: string
            stat?: string
            map?: string
            max(): number
            getSettings?(a: string): StatItem | null
        }
    }
    interface StatCategory {
        [key: string]: Stats.StatItem
    }

    var STATS_BUILD: StatCategory[]

    enum STAT_CHANGE_TYPE {
        STATS,
        MODIFIER,
        HEAL
    }

    interface StatParamType {
        key: string,
        index?: number
    }

    var STAT_PARAM_TYPE: {
        [key: string]: StatParamType
    }

    interface StatChangeSetting {
        change: STAT_CHANGE_TYPE
        type: StatParamType
        value: number
        icon: string
        grade: string
    }

    var STAT_CHANGE_SETTINGS: { [key: string]: StatChangeSetting }
    //#endregion Stats

    //#region Map
    namespace MapModel {
        interface Area {
            path: string
            chests: number
        }
    }

    interface MapModel {
        currentArea: sc.MapModel.Area
        getChestCount(this: this, key: string): number
        getTotalChestsFound(this: this, asPercent: boolean): number
        getTotalChests(this: this): number,
        getVisitedArea(this: this, area: string): boolean
        getAreaName(this: this, a?: string, b?: boolean, c?: boolean): string
    }

    interface WorldmapAreaName extends ig.GuiElementBase {
        gfx: ig.Image
        name: sc.MapNameGui
        hasText: boolean
        setText(this: this, a: string, b?: any, c?: any): void
    }

    interface MapNameGui extends ig.BoxGui {

    }

    interface MapWorldMap {
        areaName: WorldmapAreaName
        _setAreaName(this: this, a: any): void
    }

    interface MapWorldMapConstructor extends ImpactClass<MapWorldMap> { }

    interface MapChestDisplay {
        max: sc.NumberGui
        current: sc.NumberGui
        _oldMax: number
        _oldCount: number
        update(this: this): void
    }

    interface MapChestDisplayConstructor extends ImpactClass<MapChestDisplay> { }

    var MapChestDisplay: MapChestDisplayConstructor
    var MapWorldMap: MapWorldMapConstructor
    //#endregion Map

    interface PlayerModel extends ig.Class {
        skillPointsExtra: number[]
        level: number
        params: CombatParams

        onVarAccess(this: this, a: any, b: string[]): any
        getToggleItemState(this: this, id: number | string): boolean
        getParamAvgLevel(this: this, level: number): number
    }

    interface PlayerModelContructor extends ImpactClass<PlayerModel> { }

    var PlayerModel: PlayerModelContructor

    interface SaveSlotButton {
        chapter: SaveSlotChapter

        setSave(this: this, a: any, b: any, c: any): void
    }

    interface SaveSlotChapter extends ig.GuiElementBase {
        metaMarker: ig.ImageGui

        init(this: this): void
    }

    interface SaveSlotChapterConstructor extends ImpactClass<SaveSlotChapter> { }

    var SaveSlotChapter: SaveSlotChapterConstructor

    interface TrophyIcon {
        index: number
        cat: "GENERAL" | "COMBAT" | "EXPLORATION"
        hidden?: boolean
    }

    var TROPHY_ICONS: { [key: string]: TrophyIcon }

    interface TrophyIconGraphic extends ig.GuiElementBase {
        icon: ig.ImageGui
        ribbon: ig.ImageGui
        points: sc.NumberGui

        init(this: this, icon: string, stars: number, points: number, f: any): void
    }

    interface TrophyIconGraphicConstructor extends ImpactClass<TrophyIconGraphic> { }

    var TrophyIconGraphic: TrophyIconGraphicConstructor


    //#region Attacks
    enum ATTACK_TYPE {
        NONE,
        LIGHT,
        MEDIUM,
        HEAVY,
        MASSIVE,
        BREAK
    }

    interface AttackInfo extends ig.Class {
        type: sc.ATTACK_TYPE
        attackerParams: sc.CombatParams
        damageFactor: number
        defenseFactor: number
        element: sc.ELEMENT
        critFactor: number
    }

    interface CombatParams extends ig.Class {
        getModifier(this: this, modifier: string): number
        update(this: this, a: any): void
        getHpFactor(this: this): number
        getRelativeSp(this: this): number
    }

    interface HitNumberEntityBase extends ig.Entity {

    }

    var DAMAGE_MODIFIER_FUNCS: {
        [key: string]: (attackInfo: AttackInfo, damageFactor: number, combatantRoot: any, shieldResult: any, hitIgnore: any, params: sc.CombatParams) => { attackInfo: any, damageFactor: any, applyDamageCallback: any | null }
    }

    interface Modifier {
        altSheet?: string
        offX?: number
        offY?: number
        icon: number
        order: number
        noPercent: boolean
    }

    var MODIFIERS: { [key: string]: Modifier }
    //#endregion Attacks

    interface NewGamePlusModel {
        get(this: this, option: string): boolean
    }

    interface GameModel {
        player: PlayerModel
    }

    interface EnemyInfo {
        boostedLevel: number
        boss: true
    }

    var MIN_BOOSTER_LEVEL: number

    interface EnemyBooster extends ig.GameAddon {
        boosted: boolean

        updateBoosterState(this: this): void
        updateEnemyBoostState(this: this, enemy: ig.ENTITY.Enemy): void

        modelChanged(this: this, source: any, message: any): void
    }

    interface EnemyBoosterConstructor extends ImpactClass<EnemyBooster> { }

    var enemyBooster: EnemyBooster
    var EnemyBooster: EnemyBoosterConstructor

    enum ENEMY_BOOSTER_STATE {
        NONE,
        BOOSTABLE,
        BOOSTED
    }

    interface EnemyInfoBox extends ig.BoxGui {
        level: sc.NumberGui
        enemy: EnemyInfo
        setEnemy(this: this, b: any): void
    }

    interface EnemyInfoBoxConstructor extends ImpactClass<EnemyInfoBox> { }

    var EnemyInfoBox: EnemyInfoBoxConstructor

    interface EnemyEntryButton extends sc.ListBoxButton {
        key: any,
        level: sc.NumberGui

        init(this: this, b: any, enemyKey: string, d: any): void
    }

    interface EnemyEntryButtonConstructor extends ImpactClass<EnemyEntryButton> { }

    var EnemyEntryButton: EnemyEntryButtonConstructor

    interface EnemyDisplayGui extends ig.GuiElementBase {
        init(this: this, b: any, a: any, d: any, c: any, e: any, isBoosted: boolean): void
    }

    interface EnemyDisplayGuiConstructor extends ImpactClass<EnemyDisplayGui> { }

    var EnemyDisplayGui: EnemyDisplayGuiConstructor

    interface EnemyPageGeneralInfo extends ig.GuiElementBase {
        setData(this: this, a: any, b: any, f: any, g: any): void
    }

    interface EnemyPageGeneralInfoConstructor extends ImpactClass<EnemyPageGeneralInfo> { }

    var EnemyPageGeneralInfo: EnemyPageGeneralInfoConstructor

    interface Combat extends ig.GameAddon {
        enemyDataList: { [key: string]: EnemyInfo }

        canShowBoostedEntry(this: this, b: any, isBoss: boolean): boolean
    }

    interface CombatConstructor extends ImpactClass<Combat> { }

    var Combat: CombatConstructor
    var combat: Combat
}