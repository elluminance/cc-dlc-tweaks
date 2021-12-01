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

    interface CrossCode {
        getEntityByName(name: string): ig.Entity
    }

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

    interface StatsModel extends ig.GameAddon {
        set(stat: string, value: number): void
        setMax(stat: string, value: number): void
        setMin(stat: string, value: number): void

        add(stat: string, value: number): void
        subtract(stat: string, value: number): void

        setMap(map: string, key: string, value: number): void
        addMap(map: string, key: string, value: number): void
        subMap(map: string, key: string, value: number): void
    }
    var stats: StatsModel
}