import { getEntries } from "../../helper-funcs.js";

const DefaultIcon = "media/gui/gauntlet-icons/el-mod.png";

el.GauntletCup.DefaultBonusOptions = {
    HEALING: {
        HEAL_SMALL: {
            type: "heal",
            iconSrc: DefaultIcon,
            generalKey: "healing",

            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.healing",
            descReplace: [{
                original: "[!]",
                replacement: 20
            }],
            weight: 250,
			iconIndexX: 0,
            iconIndexY: 2,
            value: 0.20,
            repeat: true,
            cost: 400,
        },
        HEAL_MEDIUM: {
            type: "heal",
            iconSrc: DefaultIcon,
            generalKey: "healing",

            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.healing",
            descReplace: [{
                original: "[!]",
                replacement: 40
            }],
			iconIndexX: 0,
            iconIndexY: 2,
            value: 0.40,
            repeat: true,
            cost: 750,
            weight: 200,
        },
        HEAL_LARGE: {
            type: "heal",
            iconSrc: DefaultIcon,
            generalKey: "healing",

            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.healing",
            descReplace: [{
                original: "[!]",
                replacement: 60
            }],
			iconIndexX: 0,
            iconIndexY: 2,
            value: 0.6,
            repeat: true,
            cost: 1100,
            weight: 150,
        },
    },

    BASE_STATS: {
        MAXHP_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
			iconIndexX: 1,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.bonuses.genericName.maxhpUp",
            repeat: true,
            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.el-gauntlet.bonuses.other.maxhp_full]"
            },{
                original: "[VALUE]",
                replacement: 100
            }],
            generalKey: "hp",

            cost: 500,
            weight: 100,
            costScaleType: "LINEAR",
            costScaleFactor: 100,

            statType: "hp",
            absolute: true,
            value: 100,
        },
        ATTACK_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
			iconIndexX: 2,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.bonuses.genericName.attackUp",
            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.atk]"
            },{
                original: "[VALUE]",
                replacement: 10
            }],
            generalKey: "attack",

            cost: 500,
            weight: 200,
            costScaleType: "LINEAR",
            costScaleFactor: 100,

            statType: "attack",
            absolute: true,
            value: 10
        },
        DEFENSE_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
			iconIndexX: 3,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.bonuses.genericName.defenseUp",
            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.def]"
            },{
                original: "[VALUE]",
                replacement: 10
            }],
            generalKey: "defense",

            cost: 500,
            costScaleType: "LINEAR",
            weight: 200,
            costScaleFactor: 100,

            statType: "defense",
            absolute: true,
            value: 10
        },
        FOCUS_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
			iconIndexX: 4,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.bonuses.genericName.focusUp",
            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.foc]"
            },{
                original: "[VALUE]",
                replacement: 10
            }],
            generalKey: "focus",

            cost: 500,
            costScaleType: "LINEAR",
            costScaleFactor: 100,
            weight: 200,

            statType: "focus",
            absolute: true,
            value: 10
        },

        MAXHP_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
			iconIndexX: 6,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.bonuses.genericName.maxhpLevelUpBonus",
            repeat: true,
            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.el-gauntlet.bonuses.other.maxhp_full]"
            },{
                original: "[VALUE]",
                replacement: 30
            }],

            cost: 1000,
            costScaleType: "LINEAR",
            costScaleFactor: 250,
            weight: 200,

            statType: "hp",
            absolute: true,
            value: 30
        },
        ATTACK_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
			iconIndexX: 7,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.bonuses.genericName.attackLevelUpBonus",
            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.atk]"
            },{
                original: "[VALUE]",
                replacement: 3
            }],

            cost: 1000,
            costScaleType: "LINEAR",
            costScaleFactor: 250,
            weight: 100,

            statType: "attack",
            value: 3
        },
        DEFENSE_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
			iconIndexX: 8,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.bonuses.genericName.defenseLevelUpBonus",
            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.def]"
            },{
                original: "[VALUE]",
                replacement: 3
            }],

            cost: 1000,
            costScaleType: "LINEAR",
            costScaleFactor: 250,
            weight: 100,

            statType: "defense",
            absolute: true,
            value: 3
        },
        FOCUS_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
			iconIndexX: 9,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.bonuses.genericName.focusLevelUpBonus",
            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.foc]"
            },{
                original: "[VALUE]",
                replacement: 3
            }],

            cost: 1000,
            costScaleType: "LINEAR",
            costScaleFactor: 250,
            weight: 100,

            statType: "focus",
            absolute: true,
            value: 3
        },
    },

    //filled in below
    MODIFIERS: {},

    SP: {
        MAX_SP_1: {
            type: "statUp",
            iconSrc: DefaultIcon,
			iconIndexX: 5,
            iconIndexY: 2,
            repeat: 4,

            cost: 1000,
            costScaleType: "LINEAR",
            costScaleFactor: 1000,
            weight: 75,
            weightScaleType: "EXPONENTIAL",
            weightScaleFactor: 0.9,

            statType: "maxSp",
            value: 1
        },
    },

    STAT_SWAP: {
        ATK_UP_DEF_DOWN1: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 4,
			iconIndexY: 3,
            cost: 1500,
            weight: 25,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "attack",
                stat2: "defense",
                value: 20
            },
            repeat: true,
            condition: "player.param.defense >= 25",
            generalKey: "atkDefSwap",
            
            name: "sc.gui.el-gauntlet.bonuses.genericName.atkUpDefDown",

            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statSwap",
            descReplace: [{
                original: "[STAT1]",
                replacement: "\\l[sc.gui.menu.equip.atk]"
            },{
                original: "[STAT2]",
                replacement: "\\l[sc.gui.menu.equip.def]"
            },{
                original: "[VALUE1]",
                replacement: 20
            },{
                original: "[VALUE2]",
                replacement: 20
            }],

        },
        DEF_UP_ATK_DOWN1: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 5,
			iconIndexY: 3,
            cost: 1500,
            weight: 25,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "defense",
                stat2: "attack",
                value: 20
            },
            repeat: true,
            condition: "player.param.attack >= 25",
            generalKey: "atkDefSwap",
            
            name: "sc.gui.el-gauntlet.bonuses.genericName.defUpAtkDown",

            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statSwap",
            descReplace: [{
                original: "[STAT1]",
                replacement: "\\l[sc.gui.menu.equip.def]"
            },{
                original: "[STAT2]",
                replacement: "\\l[sc.gui.menu.equip.atk]"
            },{
                original: "[VALUE1]",
                replacement: 20
            },{
                original: "[VALUE2]",
                replacement: 20
            }],

        },
        FOC_UP_DEF_DOWN1: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 8,
			iconIndexY: 3,
            cost: 1500,
            weight: 25,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "focus",
                stat2: "defense",
                value: 20
            },
            repeat: true,
            condition: "player.param.defense >= 25",
            generalKey: "focDefSwap",
            
            name: "sc.gui.el-gauntlet.bonuses.genericName.focUpDefDown",

            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statSwap",
            descReplace: [{
                original: "[STAT1]",
                replacement: "\\l[sc.gui.menu.equip.foc]"
            },{
                original: "[STAT2]",
                replacement: "\\l[sc.gui.menu.equip.def]"
            },{
                original: "[VALUE1]",
                replacement: 20
            },{
                original: "[VALUE2]",
                replacement: 20
            }],

        },
        DEF_UP_FOC_DOWN1: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 9,
			iconIndexY: 3,
            cost: 1500,
            weight: 25,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "defense",
                stat2: "focus",
                value: 20
            },
            repeat: true,
            condition: "player.param.focus >= 25",
            generalKey: "focDefSwap",
            
            name: "sc.gui.el-gauntlet.bonuses.genericName.defUpFocDown",

            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statSwap",
            descReplace: [{
                original: "[STAT1]",
                replacement: "\\l[sc.gui.menu.equip.def]"
            },{
                original: "[STAT2]",
                replacement: "\\l[sc.gui.menu.equip.foc]"
            },{
                original: "[VALUE1]",
                replacement: 20
            },{
                original: "[VALUE2]",
                replacement: 20
            }],

        },
        ATK_UP_FOC_DOWN1: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 6,
			iconIndexY: 3,
            cost: 1500,
            weight: 25,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "attack",
                stat2: "focus",
                value: 20
            },
            repeat: true,
            condition: "player.param.focus >= 25",
            generalKey: "atkFocSwap",
            
            name: "sc.gui.el-gauntlet.bonuses.genericName.atkUpFocDown",

            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statSwap",
            descReplace: [{
                original: "[STAT1]",
                replacement: "\\l[sc.gui.menu.equip.atk]"
            },{
                original: "[STAT2]",
                replacement: "\\l[sc.gui.menu.equip.foc]"
            },{
                original: "[VALUE1]",
                replacement: 20
            },{
                original: "[VALUE2]",
                replacement: 20
            }],

        },
        FOC_UP_ATK_DOWN1: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 7,
			iconIndexY: 3,
            cost: 1500,
            weight: 25,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "focus",
                stat2: "attack",
                value: 20
            },
            repeat: true,
            condition: "player.param.attack >= 25",
            generalKey: "atkFocSwap",

            name: "sc.gui.el-gauntlet.bonuses.genericName.focUpAtkDown",

            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statSwap",
            descReplace: [{
                original: "[STAT1]",
                replacement: "\\l[sc.gui.menu.equip.foc]"
            },{
                original: "[STAT2]",
                replacement: "\\l[sc.gui.menu.equip.atk]"
            },{
                original: "[VALUE1]",
                replacement: 20
            },{
                original: "[VALUE2]",
                replacement: 20
            }],

        },
    },

    OTHER: {
        REMOVE_NEUTRAL_BONUS1: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 0,
            iconIndexY: 7,
            repeat: false,

            cost: 5000,
            weight: 10,
            minLevel: 10,
            mutuallyExclusive: [
                "INCREASE_NEUTRAL_BONUS1"
            ],

            specialFunc: "setNeutralBonus",
            specialFuncParams: {
                neutralSelfBonus: 1.25,
                neutralOtherElemBonus: 0,
            }
        },
        REMOVE_NEUTRAL_BONUS2: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 0,
            iconIndexY: 7,
            repeat: false,

            cost: 10000,
            weight: 10,
            minLevel: 20,
            requires: [
                "REMOVE_NEUTRAL_BONUS1"
            ],

            specialFunc: "setNeutralBonus",
            specialFuncParams: {
                neutralSelfBonus: 1.5,
                neutralOtherElemBonus: 0,
            }
        },
        REMOVE_NEUTRAL_BONUS3: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 0,
            iconIndexY: 7,
            repeat: false,

            cost: 15000,
            weight: 10,
            minLevel: 30,
            requires: [
                "REMOVE_NEUTRAL_BONUS2"
            ],

            specialFunc: "setNeutralBonus",
            specialFuncParams: {
                neutralSelfBonus: 1.75,
                neutralOtherElemBonus: 0,
            }
        },

        INCREASE_NEUTRAL_BONUS1: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 0,
            iconIndexY: 7,
            repeat: false,
            mutuallyExclusive: [
                "REMOVE_NEUTRAL_BONUS1"
            ],

            cost: 7500,
            weight: 10,
            minLevel: 10,

            specialFunc: "setNeutralBonus",
            specialFuncParams: {
                neutralOtherElemBonus: 0.75,
            }
        },
        INCREASE_NEUTRAL_BONUS2: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 0,
            iconIndexY: 7,
            repeat: false,

            cost: 25000,
            weight: 10,
            minLevel: 25,
            requires: [
                "INCREASE_NEUTRAL_BONUS1"
            ],

            specialFunc: "setNeutralBonus",
            specialFuncParams: {
                neutralOtherElemBonus: 1,
            }
        },
    }
}

function toPercent(value: number) {
    value *= 100;
    value = Math.round(value);
    
    return value;
}

interface ElementStatEntry {
    stat: keyof sc.CombatParams.BaseParams | keyof sc.MODIFIERS,
    langKey: string,
    statNameLangKey: string,
    bonuses: Record<keyof typeof sc.ELEMENT, number>,
    iconIndex: Vec2,
    cost: number,
    scaleFactor: number,
    weight: number,
    weightMul: PartialRecord<keyof typeof sc.ELEMENT, number>
}

function createElementBonuses(
    params: ElementStatEntry,
    obj: Record<string, el.GauntletCup.BonusEntry>,
) {
    let {
        bonuses,
        iconIndex,
        langKey,
        stat,
        statNameLangKey,
        cost, weight, scaleFactor,
        weightMul
    } = params
    for(let [element, value] of getEntries(bonuses)) {

        obj[`${stat.toUpperCase()}_${element}1`] = {
            type: "statUp",
            iconSrc: DefaultIcon,
            iconIndexX: iconIndex.x,
            iconIndexY: iconIndex.y,
            name: langKey,
            generalKey: stat,

            shortDesc: "sc.gui.el-gauntlet.bonuses.genericDesc.statUpPercentElement",
            descReplace: [{
                original: "[STAT]",
                replacement: `\\l[${statNameLangKey}]`
            },{
                original: "[VALUE]",
                replacement: toPercent(value - 1)
            },{
                original: "[ELEMENT]",
                replacement: `\\l[sc.gui.el-gauntlet.bonuses.elementName.${element}]`
            }],

            cost,
            weight: weight * (weightMul[element] ?? 1),
            costScaleType: "LINEAR",
            costScaleFactor: scaleFactor,
            
            statType: stat,
            value: bonuses[element],
            element,
        }
    }
}

createElementBonuses(
{
    stat: "attack",
    langKey: "sc.gui.el-gauntlet.bonuses.genericName.attackUp",
    statNameLangKey: "sc.gui.menu.equip.atk",
    bonuses: {
        NEUTRAL: 1.03,
        HEAT: 1.05,
        COLD: 1.04,
        SHOCK: 1.04,
        WAVE: 1.04,
    }, 
    iconIndex: {x: 2, y: 2},
    cost: 750, 
    scaleFactor: 250, 
    weight: 50,
    weightMul: {
        HEAT: 1.5
    }
}, 
    el.GauntletCup.DefaultBonusOptions.BASE_STATS,
)
createElementBonuses(
{
    stat: "defense",
    langKey: "sc.gui.el-gauntlet.bonuses.genericName.defenseUp",
    statNameLangKey: "sc.gui.menu.equip.def",
    bonuses: {
        NEUTRAL: 1.03,
        HEAT: 1.04,
        COLD: 1.05,
        SHOCK: 1.04,
        WAVE: 1.04,
    }, 
    iconIndex: {x: 3, y: 2},
    cost: 750,
    scaleFactor: 250, 
    weight: 50,
    weightMul: {
        COLD: 1.5
    }
}, 
    el.GauntletCup.DefaultBonusOptions.BASE_STATS,
)
createElementBonuses(
{
    stat: "focus",
    langKey: "sc.gui.el-gauntlet.bonuses.genericName.focusUp",
    statNameLangKey: "sc.gui.menu.equip.foc",
    bonuses: {
        NEUTRAL: 1.03,
        HEAT: 1.04,
        COLD: 1.04,
        SHOCK: 1.05,
        WAVE: 1.04,
    }, 
    iconIndex: {x: 4, y: 2},
    cost: 750,
    scaleFactor: 250, 
    weight: 50,
    weightMul: {
        SHOCK: 1.5
    }
},
    el.GauntletCup.DefaultBonusOptions.BASE_STATS,
)
createElementBonuses(
{
    stat: "hp",
    langKey: "sc.gui.el-gauntlet.bonuses.genericName.maxhpUp",
    statNameLangKey: "sc.gui.el-gauntlet.bonuses.other.maxhp_full",
    bonuses: {
        NEUTRAL: 1.03,
        HEAT: 1.04,
        COLD: 1.04,
        SHOCK: 1.04,
        WAVE: 1.05,
    }, 
    iconIndex: {x: 1, y: 2},
    cost: 750, 
    scaleFactor: 250,
    weight: 50,
    weightMul: {
        WAVE: 1.5
    }
},
    el.GauntletCup.DefaultBonusOptions.BASE_STATS,
)

function createModifierEntry(
    modifier: keyof sc.MODIFIERS,
    value: number,
    cost: number,
    costScaleFactor: number,
    weight: number,
    iconIndexX: number,
    iconIndexY: number,
) {
    el.GauntletCup.DefaultBonusOptions.MODIFIERS[`${modifier}1`] = {
        type: "modifier",
        iconSrc: DefaultIcon,
        iconIndexX,
        iconIndexY,
        name: "sc.gui.el-gauntlet.bonuses.genericName.modifier",
        nameReplace: [
            {original: "[MOD]", replacement: `\\l[sc.gui.menu.equip.modifier.${modifier}]`}
        ],
        generalKey: modifier,
        shortDesc: "sc.gui.el-gauntlet.bonuses.modifierDesc." + modifier,
        descReplace: [
            {original: "[VALUE]", replacement: toPercent(value)},
            {original: "[VALUE2]", replacement: toPercent(value*2)},
        ],
    
        statType: modifier,
        value,

        cost,
        costScaleType: "LINEAR",
        costScaleFactor,
        weight,
        weightScaleType: "EXPONENTIAL",
        weightScaleFactor: 0.95
    }
}
//#region modifiers
createModifierEntry(
    "MELEE_DMG",
    0.04, //value
    1000, //cost
    250, // cost scale factor
    70, // weight
    0, //icon X
    4, //icon Y
)
createModifierEntry(
    "RANGED_DMG",
    0.04, // value
    1000, // cost
    250, // cost scale factor
    70, // weight
    1, //icon X
    4, //icon Y
)

createModifierEntry(
    "HP_REGEN",
    0.05, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    2, //icon X
    4, //icon Y
)

createModifierEntry(
    "OVERHEAT_REDUCTION",
    0.05, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    3, //icon X
    4, //icon Y
)
createModifierEntry(
    "SP_REGEN",
    0.03, // value
    1000, // cost
    250, // cost scale factor
    25, // weight
    4, //icon X
    4, //icon Y
)
createModifierEntry(
    "STUN_THRESHOLD",
    0.05, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    6, //icon X
    4, //icon Y
)
createModifierEntry(
    "COND_HEALING",
    0.03, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    7, //icon X
    4, //icon Y
)
createModifierEntry(
    "CRITICAL_DMG",
    0.05, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    8, //icon X
    4, //icon Y
)
createModifierEntry(
    "DASH_INVINC",
    0.05, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    9, //icon X
    4, //icon Y
)

createModifierEntry(
    "ASSAULT",
    0.2, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    0, //icon X
    5, //icon Y
)
createModifierEntry(
    "GUARD_SP",
    0.05, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    1, //icon X
    5, //icon Y
)
createModifierEntry(
    "MOMENTUM",
    0.02, // value
    2500, // cost
    500, // cost scale factor
    25, // weight
    2, //icon X
    5, //icon Y
)
createModifierEntry(
    "COND_EFFECT_ALL",
    0.05, // value
    1500, // cost
    500, // cost scale factor
    50, // weight
    3, //icon X
    5, //icon Y
)
createModifierEntry(
    "KNOCKBACK",
    0.05, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    4, //icon X
    5, //icon Y
)
createModifierEntry(
    "BERSERK",
    0.1, // value
    1500, // cost
    500, // cost scale factor
    50, // weight
    5, //icon X
    5, //icon Y
)
createModifierEntry(
    "EL_RISKTAKER",
    0.05, // value
    2000, // cost
    500, // cost scale factor
    40, // weight
    7, //icon X
    5, //icon Y
)
createModifierEntry(
    "EL_OVERHEAL",
    0.2, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    8, //icon X
    5, //icon Y
)

createModifierEntry(
    "EL_NEUTRAL_BOOST",
    0.03, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    0, //icon X
    6, //icon Y
)
createModifierEntry(
    "EL_HEAT_BOOST",
    0.03, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    1, //icon X
    6, //icon Y
)
createModifierEntry(
    "EL_COLD_BOOST",
    0.03, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    2, //icon X
    6, //icon Y
)
createModifierEntry(
    "EL_SHOCK_BOOST",
    0.03, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    3, //icon X
    6, //icon Y
)
createModifierEntry(
    "EL_WAVE_BOOST",
    0.03, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    4, //icon X
    6, //icon Y
)
createModifierEntry(
    "SPIKE_DMG",
    0.05, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    5, //icon X
    6, //icon Y
)
createModifierEntry(
    "CROSS_COUNTER",
    0.05, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    6, //icon X
    6, //icon Y
)
createModifierEntry(
    "BREAK_DMG",
    0.05, // value
    1000, // cost
    250, // cost scale factor
    50, // weight
    7, //icon X
    6, //icon Y
)
//#endregion