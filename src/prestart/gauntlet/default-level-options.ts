import { getEntries } from "../../helper-funcs.js";

const PARTY_MEMBER_COST = 1000;
const DefaultIcon = "media/gui/gauntlet-icons/el-mod.png";

el.GauntletCup.DefaultLevelUpOptions = {
    PARTY: {
        PARTY_EMILIE: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
			iconIndexX: 0,
            iconIndexY: 1,
            weight: 100,
            partyMemberName: "Emilie",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Emilie && party.size < 5",
        },
        PARTY_CTRON: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
            weight: 100,
            iconIndexX: 1,
			iconIndexY: 1,
            partyMemberName: "Glasses",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Glasses && party.size < 5",
        },
        PARTY_JOERN: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
			iconIndexX: 2,
            iconIndexY: 1,
            weight: 100,
            partyMemberName: "Joern",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Joern && party.size < 5",
        },
        PARTY_APOLLO: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
			iconIndexX: 3,
            iconIndexY: 1,
            weight: 100,
            partyMemberName: "Apollo",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Apollo && party.size < 5",
        },
        PARTY_LUKAS: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
			iconIndexX: 4,
            iconIndexY: 1,
            weight: 100,
            partyMemberName: "Schneider",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Schneider && party.size < 5",
        },
        PARTY_SHIZUKA: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
			iconIndexX: 5,
            iconIndexY: 1,
            weight: 100,
            partyMemberName: "Shizuka",
            cost: PARTY_MEMBER_COST,
            scaleType: "PARTY",
            condition: "!party.has.Shizuka && party.size < 5",
        },
        PARTY_LUKE: {
            type: "addPartyMember",
            iconSrc: DefaultIcon,
			iconIndexX: 6,
            iconIndexY: 1,
            weight: 100,
            scaleType: "PARTY",
            partyMemberName: "Luke",
            cost: PARTY_MEMBER_COST,
            condition: "!party.has.Luke && party.size < 5",
        },
    },

    HEALING: {
        HEAL_SMALL: {
            type: "heal",
            iconSrc: DefaultIcon,

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.healing",
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

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.healing",
            descReplace: [{
                original: "[!]",
                replacement: 40
            }],
			iconIndexX: 0,
            iconIndexY: 2,
            value: 0.40,
            repeat: true,
            cost: 750,
            weight: 100,
        },
        HEAL_LARGE: {
            type: "heal",
            iconSrc: DefaultIcon,

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.healing",
            descReplace: [{
                original: "[!]",
                replacement: 60
            }],
			iconIndexX: 0,
            iconIndexY: 2,
            value: 0.6,
            repeat: true,
            cost: 1100,
            weight: 50,
        },
    },

    BASE_STATS: {
        MAXHP_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
			iconIndexX: 1,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.levelUp.genericName.maxhpUp",
            repeat: true,
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.el-gauntlet.levelUp.other.maxhp_full]"
            },{
                original: "[VALUE]",
                replacement: 100
            }],

            cost: 500,
            weight: 100,
            scaleType: "LINEAR",
            scaleFactor: 100,

            statType: "hp",
            absolute: true,
            value: 100,
        },
        ATTACK_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
			iconIndexX: 2,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.levelUp.genericName.attackUp",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.atk]"
            },{
                original: "[VALUE]",
                replacement: 10
            }],

            cost: 500,
            weight: 100,
            scaleType: "LINEAR",
            scaleFactor: 100,

            statType: "attack",
            absolute: true,
            value: 10
        },
        DEFENSE_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
			iconIndexX: 3,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.levelUp.genericName.defenseUp",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.def]"
            },{
                original: "[VALUE]",
                replacement: 10
            }],

            cost: 500,
            scaleType: "LINEAR",
            weight: 100,
            scaleFactor: 100,

            statType: "defense",
            absolute: true,
            value: 10
        },
        FOCUS_UP_ABS1: {
            type: "statUp",
            iconSrc: DefaultIcon,
			iconIndexX: 4,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.levelUp.genericName.focusUp",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statUpAbsolute",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.foc]"
            },{
                original: "[VALUE]",
                replacement: 10
            }],

            cost: 500,
            scaleType: "LINEAR",
            scaleFactor: 100,
            weight: 100,

            statType: "attack",
            absolute: true,
            value: 10
        },

        MAXHP_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
			iconIndexX: 6,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.levelUp.genericName.maxhpLevelUpBonus",
            repeat: true,
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.el-gauntlet.levelUp.other.maxhp_full]"
            },{
                original: "[VALUE]",
                replacement: 20
            }],

            cost: 1000,
            scaleType: "LINEAR",
            scaleFactor: 250,
            weight: 100,

            statType: "hp",
            absolute: true,
            value: 20
        },
        ATTACK_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
			iconIndexX: 7,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.levelUp.genericName.attackLevelUpBonus",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.atk]"
            },{
                original: "[VALUE]",
                replacement: 2
            }],

            cost: 1000,
            scaleType: "LINEAR",
            scaleFactor: 250,
            weight: 100,

            statType: "attack",
            value: 2
        },
        DEFENSE_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
			iconIndexX: 8,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.levelUp.genericName.defenseLevelUpBonus",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.def]"
            },{
                original: "[VALUE]",
                replacement: 2
            }],

            cost: 1000,
            scaleType: "LINEAR",
            scaleFactor: 250,
            weight: 100,

            statType: "defense",
            absolute: true,
            value: 2
        },
        FOCUS_LEVEL_UP1: {
            type: "statLevelUp",
            iconSrc: DefaultIcon,
			iconIndexX: 9,
            iconIndexY: 2,
            name: "sc.gui.el-gauntlet.levelUp.genericName.focusLevelUpBonus",
            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statLevelUp",
            descReplace: [{
                original: "[STAT]",
                replacement: "\\l[sc.gui.menu.equip.foc]"
            },{
                original: "[VALUE]",
                replacement: 2
            }],

            cost: 1000,
            scaleType: "LINEAR",
            scaleFactor: 250,
            weight: 100,

            statType: "attack",
            absolute: true,
            value: 2
        },
    },

    SP: {
        MAX_SP_1: {
            type: "statUp",
            iconSrc: DefaultIcon,
			iconIndexX: 5,
            iconIndexY: 2,
            repeat: 4,

            cost: 1000,
            scaleType: "LINEAR",
            scaleFactor: 1000,
            weight: 10,

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
            weight: 50,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "attack",
                stat2: "defense",
                value: 20
            },
            repeat: true,
            condition: "player.param.defense >= 25",
            
            name: "sc.gui.el-gauntlet.levelUp.genericName.atkUpDefDown",

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statSwap",
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
            weight: 50,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "defense",
                stat2: "attack",
                value: 20
            },
            repeat: true,
            condition: "player.param.attack >= 25",
            
            name: "sc.gui.el-gauntlet.levelUp.genericName.atkUpDefDown",

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statSwap",
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
            weight: 50,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "focus",
                stat2: "defense",
                value: 20
            },
            repeat: true,
            condition: "player.param.defense >= 25",
            
            name: "sc.gui.el-gauntlet.levelUp.genericName.focUpDefDown",

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statSwap",
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
            weight: 50,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "defense",
                stat2: "focus",
                value: 20
            },
            repeat: true,
            condition: "player.param.focus >= 25",
            
            name: "sc.gui.el-gauntlet.levelUp.genericName.defUpFocDown",

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statSwap",
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
            weight: 50,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "attack",
                stat2: "focus",
                value: 20
            },
            repeat: true,
            condition: "player.param.focus >= 25",
            
            name: "sc.gui.el-gauntlet.levelUp.genericName.atkUpFocDown",

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statSwap",
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
            weight: 50,
            specialFunc: "statSwap",
            specialFuncParams: {
                stat1: "focus",
                stat2: "attack",
                value: 20
            },
            repeat: true,
            condition: "player.param.attack >= 25",

            name: "sc.gui.el-gauntlet.levelUp.genericName.focUpAtkDown",

            shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statSwap",
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
        REMOVE_NEUTRAL_BONUS: {
            type: "special",
            iconSrc: DefaultIcon,
            iconIndexX: 0,
            iconIndexY: 7,
            repeat: false,

            cost: 5000,
            weight: 25,
            minLevel: 10,

            specialFunc: "setNeutralBonus",
            specialFuncParams: {
                neutralSelfBonus: 1.75,
                neutralOtherElemBonus: 0,
            }
        }
    }
}

function toPercent(value: number) {
    value -= 1;
    value *= 100;
    value = Math.round(value);
    
    return value;
}

function createElementBonuses(
    stat: keyof sc.CombatParams.BaseParams | keyof sc.MODIFIERS,
    langKey: string,
    statNameLangKey: string,
    bonuses: Record<keyof typeof sc.ELEMENT, number>,
    iconIndex: Vec2,
    obj: Record<string, el.GauntletCup.LevelUpEntry>,
    isModifier = false,
    cost = 500,
    scaleFactor = 100,
    weight = 100,
) {
    for(let [element, value] of getEntries(bonuses)) {

        obj[`${stat.toUpperCase()}_${element}1`] = {
                type: isModifier ? "modifier" : "statUp",
                iconSrc: DefaultIcon,
                iconIndexX: iconIndex.x,
                iconIndexY: iconIndex.y,
                name: langKey,
    
                shortDesc: "sc.gui.el-gauntlet.levelUp.genericDesc.statUpPercentElement",
                descReplace: [{
                    original: "[STAT]",
                    replacement: `\\l[${statNameLangKey}]`
                },{
                    original: "[VALUE]",
                    replacement: toPercent(value)
                },{
                    original: "[ELEMENT]",
                    replacement: `\\l[sc.gui.el-gauntlet.levelUp.elementName.${element}]`
                }],
    
                cost,
                weight,
                scaleType: "LINEAR",
                scaleFactor,
                
                statType: stat,
                value: bonuses[element],
                element,
            }
        }
}

createElementBonuses(
    "attack",
    "sc.gui.el-gauntlet.levelUp.genericName.attackUp",
    "sc.gui.menu.equip.atk",
    {
        NEUTRAL: 1.02,
        HEAT: 1.04,
        COLD: 1.03,
        SHOCK: 1.03,
        WAVE: 1.03,
    }, 
    {x: 2, y: 2},
    el.GauntletCup.DefaultLevelUpOptions.BASE_STATS,
    false,
    750, //cost
    250, //cost gain
    50, //weight
)
createElementBonuses(
    "defense",
    "sc.gui.el-gauntlet.levelUp.genericName.defenseUp",
    "sc.gui.menu.equip.def",
    {
        NEUTRAL: 1.02,
        HEAT: 1.03,
        COLD: 1.04,
        SHOCK: 1.03,
        WAVE: 1.03,
    }, 
    {x: 3, y: 2},
    el.GauntletCup.DefaultLevelUpOptions.BASE_STATS,
    false,
    750, //cost
    250, //cost gain
    50, //weight
)
createElementBonuses(
    "focus",
    "sc.gui.el-gauntlet.levelUp.genericName.focusUp",
    "sc.gui.menu.equip.foc",
    {
        NEUTRAL: 1.02,
        HEAT: 1.04,
        COLD: 1.03,
        SHOCK: 1.03,
        WAVE: 1.03,
    }, 
    {x: 4, y: 2},
    el.GauntletCup.DefaultLevelUpOptions.BASE_STATS,
    false,
    750, //cost
    250, //cost gain
    50, //weight
)
createElementBonuses(
    "hp",
    "sc.gui.el-gauntlet.levelUp.genericName.maxhpUp",
    "sc.gui.el-gauntlet.levelUp.other.maxhp_full",
    {
        NEUTRAL: 1.02,
        HEAT: 1.03,
        COLD: 1.03,
        SHOCK: 1.03,
        WAVE: 1.04,
    }, 
    {x: 1, y: 2},
    el.GauntletCup.DefaultLevelUpOptions.BASE_STATS,
    false,
    750, //cost
    250, //cost gain
    50, //weight
)