interface Dict<T> {
    [a: string]: T
}

declare namespace ig {
    namespace ACTION_STEP {
        interface EL_SET_TARGET extends ig.ActionStepBase {
            name: string;
        }
        interface EL_SET_TARGET_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET> {

        }
        var EL_SET_TARGET: EL_SET_TARGET_CONSTRUCTOR;

        

        interface EL_SET_TARGET_POS extends ig.ActionStepBase {
            newPos: coordinates3D
            random: boolean
            randRange: coordinates2D
        }
        interface EL_SET_TARGET_POS_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET_POS>{}

        var EL_SET_TARGET_POS: EL_SET_TARGET_POS_CONSTRUCTOR;
    }
    
    interface coordinates2D {
        x: number
        y: number
    }
    interface coordinates3D extends coordinates2D{
        z: number
    }

    interface ActionConstructor{
        getVec3(a: coordinates3D, b: ig.ActorEntity, c: Vec3): Vec3
    }

    interface ActorEntity {
        getTarget(): ig.ActorEntity
    }

    interface Vars extends ig.Class {
        get(a: string): any
        set(a: string, b: any): void
        add(a: string, b: any): void
        sub(a: string, b: any): void
        mul(a: string, b: any): void
        div(a: string, b: any): void
        mod(a: string, b: any): void
        and(a: string, b: any): void
        or(a: string, b: any): void
        xor(a: string, b: any): void
    }

    interface VarsConstructor extends ImpactClass<Vars>{}

    var vars: Vars
    var Vars: VarsConstructor

    interface Extensions {
        enabled: Dict<boolean>
    }

    var extensions: Extensions
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
        getEntityByName(name: string): ig.Entity
    }

    //#region Arena
    interface ArenaCupOptions {
        order?: number,
        id?: string
    }

    interface ArenaCup {
        order: number
    }

    interface Arena extends ig.GameAddon{
        active: boolean
        trackedCups: string[]
        cups: Dict<ArenaCup>

        init(this: this): void
        registerCup(this: this, a: string, b: ArenaCupOptions): void
        onPreDamageApply(this: this, a: any, b: any, c: any, d: any, e: any): void
        addScore(this: this, a: string, b: number): void
        getTotalArenaCompletion(this: this): number
        getCupCompletion(this: this, cupName: string): number
        getTotalDefaultTrophies(this: this, a: number, c: boolean): number
        getCupTrophy(this: this, a: string): number
        isCupUnlocked(this: this, a: string): boolean
        getTotalDefaultCups(this: this, sorted: boolean): Dict<ArenaCup>
        isCupCustom(this: this, cupName: string): boolean
        isEnemyBlocked(this: this, a: any): boolean
    }

    interface ArenaConstructor extends ImpactClass<Arena> {}
    
    var Arena: ArenaConstructor
    var arena: Arena

    interface ArenaBonusObjective {
        _type: string,
        order: number,
        displayRangePoints: boolean,

        init(a: any, b: any): void
        check(a: any): boolean
        getText(a: string, b: any, c: boolean): string
        getPoints(a: any, b: any): number
    }

    var ARENA_BONUS_OBJECTIVE: Dict<ArenaBonusObjective>
    //#endregion Arena

    //#region Stats
    interface StatsModel extends ig.GameAddon {
        set(this: this, stat: string, value: number): void
        setMax(this: this, stat: string, value: number): void
        setMin(this: this, stat: string, value: number): void

        add(this: this, stat: string, value: number): void
        subtract(this: this, stat: string, value: number): void

        getMap(this: this, map: string, key: string): number
        setMap(this: this, map: string, key: string, value: number): void
        addMap(this: this, map: string, key: string, value: number): void
        subMap(this: this, map: string, key: string, value: number): void
    }
    var stats: StatsModel

    interface StatsModelConstructor extends ImpactClass<StatsModel> {
        new(): StatsModel
    }

    var StatsModel: StatsModelConstructor

    interface StatItem {
        getSettings(a: string): any
    }

    interface StatCategory {
        [key: string]: StatItem
    }


    var STATS_BUILD: StatCategory[]

    enum STAT_CHANGE_TYPE {
        STATS,
        MODIFIER,
        HEAL
    }

    var STAT_PARAM_TYPE: {
        [key: string]: {
            key: string,
            index?: number
        }
    }

    interface StatChangeSetting {
        change: sc.STAT_CHANGE_TYPE
    }

    var STAT_CHANGE_SETTINGS: Dict<StatChangeSetting>
    //#endregion Stats

    //#region Map
    namespace MapModel{
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
        getAreaName(this: this, a: string, b: boolean, c: boolean): string
    }

    interface WorldmapAreaName extends ig.GuiElementBase{
        gfx: ig.Image
        name: sc.MapNameGui
        hasText: boolean
        setText(this: this, a: string, b?: any, c?: any): void
    }
    
    interface MapNameGui extends ig.BoxGui{
        
    }

    interface MapWorldMap {
        areaName: WorldmapAreaName
        _setAreaName(this: this, a: any): void
    }

    interface MapWorldMapConstructor extends ImpactClass<MapWorldMap>{}

    interface MapChestDisplay{
        max: sc.NumberGui
        current: sc.NumberGui
        _oldMax: number
        _oldCount: number
        update(this: this): void
    }

    interface MapChestDisplayConstructor extends ImpactClass<MapChestDisplay>{}

    var MapChestDisplay: MapChestDisplayConstructor
    var MapWorldMap: MapWorldMapConstructor
    //#endregion Map

    interface PlayerModel extends ig.Class {
        skillPointsExtra: number[]
        onVarAccess(this: this, a: any, b: string[]): any
    }

    interface PlayerModelContructor extends ImpactClass<PlayerModel> {}

    var PlayerModel: PlayerModelContructor

    interface SaveSlotButton{
        chapter: SaveSlotChapter

        setSave(this: this, a: any, b: any, c: any): void
    }

    interface SaveSlotChapter extends ig.GuiElementBase{
        postgameStarGfx: ig.Image
        postgameStar: ig.ImageGui
        metaMarker: ig.ImageGui

        init(this: this): void

        showPostgameStar(this: this, dlcBeaten: boolean, gameBeaten: boolean): void
    }

    interface SaveSlotChapterConstructor extends ImpactClass<SaveSlotChapter> {}

    var SaveSlotChapter: SaveSlotChapterConstructor

    interface TrophyIcon { 
        index: number
        cat: "GENERAL" | "COMBAT" | "EXPLORATION"
        hidden?: boolean,
        sheet?: string
        customIndex?: number
    }

    var TROPHY_ICONS: Dict<TrophyIcon>

    interface TrophyIconGraphic extends ig.GuiElementBase {
        customIcons: Dict<ig.Image>
        icon: ig.ImageGui
        ribbon: ig.ImageGui
        points: sc.NumberGui
        
        init(this: this, icon: string, stars: number, points: number, f: any): void
    }

    interface TrophyIconGraphicConstructor extends ImpactClass<TrophyIconGraphic> {}

    var TrophyIconGraphic: TrophyIconGraphicConstructor
}