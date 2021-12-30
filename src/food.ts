const newFoods = [
    "el_COOKIE_S",
    "el_COOKIE_M",
    "el_COOKIE_L",
    "el_HOT_DOG",
    "el_HOT_GOD_WITH_JELLY"
]

sc.foodAPI.register("el-mod", "el-mod-foods.png", newFoods)

sc.STAT_PARAM_TYPE.EL_RISKTAKER = {
    key: "EL_RISKTAKER"
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
        value: 0.4,
        icon: "stat-critical-dmg",
        grade: "stat-rank-2"
    },
    "EL-CRITICAL_DMG-3": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.CRITICAL_DMG,
        value: 0.6,
        icon: "stat-critical-dmg",
        grade: "stat-rank-3"
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
        value: 0.3,
        icon: "stat-dash-invinc",
        grade: "stat-rank-2"
    },

    "EL-DASH_INVINC-3": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.DASH_INVINC,
        value: 0.6,
        icon: "stat-dash-invinc",
        grade: "stat-rank-3"
    },

    "EL-MOMENTUM-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.MOMENTUM,
        value: 0.1,
        icon: "stat-momentum",
        grade: "stat-rank-2"
    },

    "EL-COND_EFFECT_ALL-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.COND_EFFECT_ALL,
        value: 0.15,
        icon: "stat-cond-effect-all",
        grade: "stat-rank-2"
    },

    "EL-RISKTAKER-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.EL_RISKTAKER,
        value: 0.15,
        icon: "stat-el-risktaker",
        grade: "stat-rank-2"
    },

    "EL-DEFENSE-MINUS-2": {
        change: sc.STAT_CHANGE_TYPE.STATS,
        type: sc.STAT_PARAM_TYPE.DEFENSE,
        value: 0.75,
        negative: true,
        icon: "stat-defense",
        grade: "stat-rank-down-3"
    },

    "EL-ASSAULT-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.ASSAULT,
        value: 0.25,
        icon: "stat-assault",
        grade: "stat-rank-1"
    },

    "EL-ASSAULT-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.ASSAULT,
        value: 0.60,
        icon: "stat-assault",
        grade: "stat-rank-1"
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
        grade: "stat-rank-1"
    }
})