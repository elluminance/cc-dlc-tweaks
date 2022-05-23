export default function() {
const newFoods = [
    "el_COOKIE_S",
    "el_COOKIE_M",
    "el_COOKIE_L",
    "el_HOT_DOG",
    "el_HOT_GOD_WITH_JELLY",
    "el_ORANGE_JOE"
]

sc.foodAPI.register("el-mod", "el-mod-foods.png", newFoods)

sc.STAT_PARAM_TYPE.EL_RISKTAKER = {
    key: "EL_RISKTAKER"
};
sc.STAT_PARAM_TYPE.AIM_SPEED = {
    key: "AIM_SPEED"
};

Object.assign(sc.STAT_CHANGE_SETTINGS, {
    "EL-CRITICAL_DMG-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.CRITICAL_DMG,
        value: 0.2,
        icon: "stat-critical-dmg",
        grade: "stat-rank-1"
    },
    "EL-CRITICAL_DMG-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.CRITICAL_DMG,
        value: 0.3,
        icon: "stat-critical-dmg",
        grade: "stat-rank-2"
    },
    "EL-CRITICAL_DMG-3": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.CRITICAL_DMG,
        value: 0.4,
        icon: "stat-critical-dmg",
        grade: "stat-rank-3"
    },
    "EL-CRITICAL_DMG-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.CRITICAL_DMG,
        value: 0.2,
        negative: true,
        icon: "stat-critical-dmg",
        grade: "stat-rank-down-1"
    },
    "EL-CRITICAL_DMG-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.CRITICAL_DMG,
        value: 0.3,
        negative: true,
        icon: "stat-critical-dmg",
        grade: "stat-rank-down-1"
    },

    "EL-DASH_INVINC-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.DASH_INVINC,
        value: 0.1,
        icon: "stat-dash-invinc",
        grade: "stat-rank-1"
    },
    "EL-DASH_INVINC-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.DASH_INVINC,
        value: 0.2,
        icon: "stat-dash-invinc",
        grade: "stat-rank-2"
    },
    "EL-DASH_INVINC-3": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.DASH_INVINC,
        value: 0.3,
        icon: "stat-dash-invinc",
        grade: "stat-rank-3"
    },
    "EL-DASH_INVINC-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.DASH_INVINC,
        value: 0.1,
        negative: true,
        icon: "stat-dash-invinc",
        grade: "stat-rank-down-1"
    },
    "EL-DASH_INVINC-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.DASH_INVINC,
        value: 0.2,
        negative: true,
        icon: "stat-dash-invinc",
        grade: "stat-rank-down-2"
    },

    "EL-MOMENTUM-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.MOMENTUM,
        value: 0.1,
        icon: "stat-momentum",
        grade: "stat-rank-1"
    },
    "EL-MOMENTUM-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.MOMENTUM,
        value: 0.15,
        icon: "stat-momentum",
        grade: "stat-rank-2"
    },
    "EL-MOMENTUM-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.MOMENTUM,
        value: 0.1,
        negative: true,
        icon: "stat-momentum",
        grade: "stat-rank-down-1"
    },
    "EL-MOMENTUM-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.MOMENTUM,
        value: 0.15,
        negative: true,
        icon: "stat-momentum",
        grade: "stat-rank-down-2"
    },

    "EL-COND_EFFECT_ALL-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.COND_EFFECT_ALL,
        value: 0.1,
        icon: "stat-cond-effect-all",
        grade: "stat-rank-2"
    },
    "EL-COND_EFFECT_ALL-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.COND_EFFECT_ALL,
        value: 0.15,
        icon: "stat-cond-effect-all",
        grade: "stat-rank-2"
    },
    "EL-COND_EFFECT_ALL-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.COND_EFFECT_ALL,
        value: 0.1,
        icon: "stat-cond-effect-all",
        grade: "stat-rank-down-1"
    },
    "EL-COND_EFFECT_ALL-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.COND_EFFECT_ALL,
        value: 0.15,
        negative: true,
        icon: "stat-cond-effect-all",
        grade: "stat-rank-down-2"
    },

    "EL-RISKTAKER-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.EL_RISKTAKER,
        value: 0.1,
        icon: "stat-el-risktaker",
        grade: "stat-rank-1"
    },
    "EL-RISKTAKER-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.EL_RISKTAKER,
        value: 0.15,
        icon: "stat-el-risktaker",
        grade: "stat-rank-2"
    },
    "EL-RISKTAKER-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.EL_RISKTAKER,
        value: 0.1,
        negative: true,
        icon: "stat-el-risktaker",
        grade: "stat-rank-down-1"
    },
    "EL-RISKTAKER-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.EL_RISKTAKER,
        value: 0.15,
        negative: true,
        icon: "stat-el-risktaker",
        grade: "stat-rank-down-2"
    },

    "EL-ATTACK-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.ATTACK,
        value: 0.9,
        negative: true,
        icon: "stat-attack",
        grade: "stat-rank-down-1"
    },
    "EL-ATTACK-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.ATTACK,
        value: 0.8,
        negative: true,
        icon: "stat-attack",
        grade: "stat-rank-down-2"
    },

    "EL-DEFENSE-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.DEFENSE,
        value: 0.9,
        negative: true,
        icon: "stat-defense",
        grade: "stat-rank-down-1"
    },
    "EL-DEFENSE-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.DEFENSE,
        value: 0.8,
        negative: true,
        icon: "stat-defense",
        grade: "stat-rank-down-2"
    },
    "EL-DEFENSE-MINUS-3": {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.DEFENSE,
        value: 0.75,
        negative: true,
        icon: "stat-defense",
        grade: "stat-rank-down-3"
    },

    "EL-FOCUS-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.FOCUS,
        value: 0.9,
        negative: true,
        icon: "stat-focus",
        grade: "stat-rank-down-1"
    },
    "EL-FOCUS-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.FOCUS,
        value: 0.8,
        negative: true,
        icon: "stat-focus",
        grade: "stat-rank-down-2"
    },
    "EL-HP-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.HP,
        value: 0.9,
        negative: true,
        icon: "stat-hp",
        grade: "stat-rank-down-1"
    },
    "EL-HP-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.HP,
        value: 0.8,
        negative: true,
        icon: "stat-hp",
        grade: "stat-rank-down-2"
    },
    

    "EL-ASSAULT-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.ASSAULT,
        value: 0.2,
        icon: "stat-assault",
        grade: "stat-rank-1"
    },
    "EL-ASSAULT-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.ASSAULT,
        value: 0.4,
        icon: "stat-assault",
        grade: "stat-rank-2"
    },
    "EL-ASSAULT-3": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.ASSAULT,
        value: 0.6,
        icon: "stat-assault",
        grade: "stat-rank-3"
    },
    "EL-ASSAULT-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.ASSAULT,
        value: 0.2,
        negative: true,
        icon: "stat-assault",
        grade: "stat-rank-down-1"
    },

    "EL-BERSERK-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.BERSERK,
        value: 0.15,
        icon: "stat-berserk",
        grade: "stat-rank-1"
    },
    "EL-BERSERK-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.BERSERK,
        value: 0.30,
        icon: "stat-assault",
        grade: "stat-rank-2"
    },
    "EL-BERSERK-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.BERSERK,
        value: 0.15,
        negative: true,
        icon: "stat-berserk",
        grade: "stat-rank-down-1"
    },
    "EL-BERSERK-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.BERSERK,
        value: 0.15,
        negative: true,
        icon: "stat-berserk",
        grade: "stat-rank-down-2"
    },

    "EL-AIM_SPEED-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.AIM_SPEED,
        value: -0.35,
        negative: true,
        icon: "stat-aiming-speed",
        grade: "stat-rank-down-1"
    },

    "EL-MELEE_DMG-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.MELEE_DMG,
        value: 0.1,
        negative: true,
        icon: "stat-melee",
        grade: "stat-rank-down-1"
    },
    "EL-MELEE_DMG-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.MELEE_DMG,
        value: 0.2,
        negative: true,
        icon: "stat-melee",
        grade: "stat-rank-down-2"
    },

    "EL-RANGED_DMG-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.RANGED_DMG,
        value: 0.1,
        negative: true,
        icon: "stat-ranged",
        grade: "stat-rank-down-1"
    },
    "EL-RANGED_DMG-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.RANGED_DMG,
        value: 0.2,
        negative: true,
        icon: "stat-ranged",
        grade: "stat-rank-down-2"
    },

    "DASH-STEP-MINUS-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.DASH_STEP,
        value: 1,
        negative: true,
        icon: "stat-dash",
        grade: "stat-rank-down-1"
    },
})
}