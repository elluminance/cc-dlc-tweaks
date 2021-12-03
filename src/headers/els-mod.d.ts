declare namespace ig {
    namespace ACTION_STEP {
        interface EL_SET_TARGET extends ig.ActionStepBase {
            name: string;
        }
        interface EL_SET_TARGET_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET> {
        }
        var EL_SET_TARGET: EL_SET_TARGET_CONSTRUCTOR;

        interface EL_SET_TARGET_POS extends ig.ActionStepBase {
            newPos: Vec3
            random: boolean
            randRange: Vec2
        }
        interface EL_SET_TARGET_POS_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET_POS> { }

        var EL_SET_TARGET_POS: EL_SET_TARGET_POS_CONSTRUCTOR;
    }
}

declare namespace sc {
    interface Arena {
        trackedCups: string[]
    }

    interface TrophyIcon {
        sheet?: string
        customIndex?: number
    }

    interface TrophyIconGraphic {
        customIcons: { [key: string]: ig.Image }
    }

    interface CombatParams {
        el_lifestealTimer: number
        el_lifestealHealed: number
    }

    interface EnemyBooster {
        ascendedBooster: {
            active: boolean,
            skipCheck: boolean,
            forceCheck: boolean,
            calcLevel(enemyType: sc.EnemyInfo): number,
        }
    }

    interface SaveSlotChapter {
        postgameStarGfx: ig.Image
        postgameStar: ig.ImageGui

        showPostgameStar(this: this, dlcBeaten: boolean, gameBeaten: boolean): void
    }

    interface MapModel {
        extraChestList: {[area: string]: string[]}
        getExtraFoundChests(this: this, area: string): number
        getExtraAreaChests(this: this, area: string): number
        getTotalExtraFoundChests(this: this): number
        getTotalExtraChests(this: this): number
    }
}