foodAPI.register("el-mod","el-mod-foods.png",["el_COOKIE_S","el_COOKIE_M","el_COOKIE_L"])

Object.assign(sc.STAT_CHANGE_SETTINGS,{
    "CRITICAL_DMG-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.CRITICAL_DMG,
        value: 0.2,
        icon: "stat-critical-dmg",
        grade: "stat-rank-1"
    },
    "CRITICAL_DMG-2": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.CRITICAL_DMG,
        value: 0.4,
        icon: "stat-critical-dmg",
        grade: "stat-rank-2"
    },
    "CRITICAL_DMG-3": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.CRITICAL_DMG,
        value: 0.6,
        icon: "stat-critical-dmg",
        grade: "stat-rank-3"
    },

    "DASH_INVINC-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.DASH_INVINC,
        value: 0.2,
        icon: "stat-dash-invinc",
        grade: "stat-rank-1"
    },

    "MOMENTUM-1": {
        change: sc.STAT_CHANGE_TYPE.MODIFIER,
        type: sc.STAT_PARAM_TYPE.MOMENTUM,
        value: 0.05,
        icon: "stat-dash-invinc",
        grade: "stat-rank-1"
    }
})