import { genBuffString, numberToElementName } from "../../helper-funcs.js"

export default function () {
    Object.assign(sc.MODIFIERS, {
        EL_RISKTAKER: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 0,
            offY: 0,
            icon: -1,
            order: 0,
            noPercent: false
        },

        EL_LIFESTEAL: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 1,
            offY: 0,
            icon: -1,
            order: 0
        },

        EL_GEODE_FINDER: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 2,
            offY: 0,
            icon: -1,
            order: 0,
            noPercent: false
        },

        EL_COND_GUARD_ALL: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 9,
            offY: 0,
            icon: -1,
            order: 0,
        },

        EL_OVERHEAL: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 10,
            offY: 0,
            icon: -1,
            order: 0,
        },

        EL_TRICKSTER: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 11,
            offY: 0,
            icon: -1,
            order: 0,
            noPercent: true,
        },

        EL_TRANCE: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 3,
            offY: 0,
            icon: -1,
            order: 0,
            noPercent: true
        },



        EL_NEUTRAL_BOOST: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 4,
            offY: 0,
            icon: -1,
            order: 0,
        },

        EL_HEAT_BOOST: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 5,
            offY: 0,
            icon: -1,
            order: 0,
        },

        EL_COLD_BOOST: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 6,
            offY: 0,
            icon: -1,
            order: 0,
        },

        EL_SHOCK_BOOST: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 7,
            offY: 0,
            icon: -1,
            order: 0,
        },

        EL_WAVE_BOOST: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 8,
            offY: 0,
            icon: -1,
            order: 0,
        },
    })

    sc.DAMAGE_MODIFIER_FUNCS.EL_RISKTAKER = (attackInfo, damageFactor, combatantRoot, shieldResult, hitIgnore, params) => {
        // apply increased damage on the offense.
        damageFactor *= 1 + attackInfo.attackerParams.getModifier("EL_RISKTAKER")
        // doubles incoming risktaker damage
        damageFactor *= 1 + Math.max((params.getModifier("EL_RISKTAKER") * 2), 0.5)

        return { attackInfo, damageFactor, applyDamageCallback: null }
    }

    //#region
    const lifestealCooldown = 1/5;
    const cooldownPower = 3;
    const cooldownConstant = lifestealCooldown ** -cooldownPower;
    const lifestealMultiplier = 0.04;

    sc.EL_TRICKSTER_STAT_CHANGES = [
        "HP-1",
        "HP-2",
        "EL-HP-MINUS-1",
        "EL-HP-MINUS-2",

        "ATTACK-1",
        "ATTACK-2",
        "EL-ATTACK-MINUS-1",
        "EL-ATTACK-MINUS-2",

        "DEFENSE-1",
        "DEFENSE-2",
        "EL-DEFENSE-MINUS-1",
        "EL-DEFENSE-MINUS-2",

        "FOCUS-1",
        "FOCUS-2",
        "EL-FOCUS-MINUS-1",
        "EL-FOCUS-MINUS-2",

        "EL-CRITICAL_DMG-1",
        "EL-CRITICAL_DMG-2",
        "EL-CRITICAL_DMG-MINUS-1",
        "EL-CRITICAL_DMG-MINUS-2",

        "EL-DASH_INVINC-1",
        "EL-DASH_INVINC-2",
        "EL-DASH_INVINC-MINUS-1",
        "EL-DASH_INVINC-MINUS-2",

        "EL-MOMENTUM-1",
        "EL-MOMENTUM-2",
        "EL-MOMENTUM-MINUS-1",
        "EL-MOMENTUM-MINUS-2",

        "EL-COND_EFFECT_ALL-1",
        "EL-COND_EFFECT_ALL-2",
        "EL-COND_EFFECT_ALL-MINUS-1",
        "EL-COND_EFFECT_ALL-MINUS-2",

        "EL-ASSAULT-1",
        "EL-ASSAULT-2",
        "EL-ASSAULT-MINUS-1",

        "EL-BERSERK-1",
        "EL-BERSERK-2",
        "EL-BERSERK-MINUS-1",
        "EL-BERSERK-MINUS-2",

        "HEAT-RES-1",
        "HEAT-RES-2",
        "COLD-RES-1",
        "COLD-RES-2",
        "SHOCK-RES-1",
        "SHOCK-RES-2",
        "WAVE-RES-1",
        "WAVE-RES-2",

        "REGEN-1",
        "REGEN-2",
        "OVERHEAT-1",
        "OVERHEAT-2",
        "SP_REGEN-1",
        "SP_REGEN-2",
        "COND_HEALING-1",
        "COND_HEALING-2",

        "MELEE_DMG-1",
        "MELEE_DMG-2",
        "EL-MELEE_DMG-MINUS-1",
        "EL-MELEE_DMG-MINUS-2",

        "RANGED_DMG-1",
        "RANGED_DMG-2",
        "EL-RANGED_DMG-MINUS-1",
        "EL-RANGED_DMG-MINUS-2",

        "DASH-STEP-1",
        "DASH-STEP-MINUS-1",
    ]

    function generateTricksterBuffs() {
        // generate an integer between 1-4 (inclusive)
        let i = Math.random(),
            bufflist: string[] = [],
            buff: string;
        
        if(i <= 0.15) {
            i = 1;
        } else if(i <= 0.6) {
            i = 2;
        } else if(i <= 0.9) {
            i = 3;
        } else i = 4;

        while(i --> 0) {
            do {
                buff = sc.EL_TRICKSTER_STAT_CHANGES.random();
            } while (bufflist.find(value => sc.STAT_CHANGE_SETTINGS[buff].type === sc.STAT_CHANGE_SETTINGS[value].type))
            bufflist.push(buff);
        }

        return bufflist;
    }

    sc.CombatParams.inject({
        el_lifestealHealed: 0,
        el_lifestealTimer: 0,
        el_tricksterTimer: 0,
        el_tricksterBuff: null,

        update(inCombat) {
            this.parent(inCombat);
            this.el_lifestealTimer -= ig.system.tick;
            if(this.getModifier("EL_TRICKSTER")) {
                this.el_tricksterTimer -= ig.system.tick;
                if(this.el_tricksterTimer <= 0) {

                    this.el_tricksterTimer = 5;
                    if(this.el_tricksterBuff) {
                        let tempHp = this.getStat("hp") - this.currentHp;
                        this.el_tricksterBuff.changeStat(generateTricksterBuffs());
                        this.currentHp = this.getStat("hp") - tempHp;
                        sc.Model.notifyObserver(this, sc.COMBAT_PARAM_MSG.STATS_CHANGED)
                    } else {
                        this.el_tricksterBuff = new sc.DynamicBuff("trickster", generateTricksterBuffs());
                        this.addBuff(this.el_tricksterBuff);
                    }
                }
            } else {
                if(this.el_tricksterBuff) {
                    this.el_tricksterBuff.active = false;
                    this.removeBuff(this.el_tricksterBuff);
                    sc.Model.notifyObserver(this, sc.COMBAT_PARAM_MSG.BUFF_REMOVED, this.el_tricksterBuff);
                    this.el_tricksterBuff = undefined;
                }
                this.el_tricksterTimer = 0;
            }
        },

        getDamage(attackInfo, damageFactorMod, combatant, shieldResult, j) {
            const damageResult = this.parent(attackInfo, damageFactorMod, combatant, shieldResult, j);

            let rootCombatant = combatant.getCombatantRoot(),
                combatantParams = rootCombatant.params,
                lifesteal = combatantParams.getModifier("EL_LIFESTEAL");
            // the this.combatant !== rootCombatant is simply to make sure that any self inflicted damage (i.e. jolt)
            // does not trigger life steal. wouldn't make sense to steal from yourself, y'know?
            if (lifesteal > 0 && (this.combatant !== rootCombatant)) {
                let relativeDamage = damageResult.damage * lifestealMultiplier;

                
                if(rootCombatant.isPlayer) {
                    /*
                     * helps compensate for glass cannons doing significantly more damage
                     * by reducing the relative amount of HP regained if your attack is
                     * significantly higher than your max HP
                     */
                    relativeDamage *= Math.min(combatantParams.getStat("hp", true) / (10 * combatantParams.getStat("attack", true)), 4);

                    // undoes NG+ sergey hax
                    if (sc.newgame.get("sergey-hax") && !ig.vars.get("g.newgame.ignoreSergeyHax")) {
                        relativeDamage /= 4096;
                    }

                    // undoes normal sergey hax
                    if(combatantParams.buffs.some(buff => buff instanceof sc.ActionBuff && buff.name == "sergeyHax")) {
                        relativeDamage *= combatantParams.getStat("attack", true) / combatantParams.getStat("attack", true)
                    }
                }

                // avoid division by 0, while scaling the damage dealt logarithmically
                relativeDamage = relativeDamage !== 0 ? relativeDamage / Math.log1p(relativeDamage) : 0; 
                relativeDamage *= 1 + lifesteal;
                
                // caps lifesteal healing at 5% max HP
                relativeDamage = Math.min(combatantParams.getStat("hp") / 20, relativeDamage);

                let adjustedHealth = combatantParams.el_lifestealHealed * (1 - cooldownConstant * (this.el_lifestealTimer ** cooldownPower));
                if ((combatantParams.el_lifestealTimer > 0) && (relativeDamage > adjustedHealth)) {
                    combatantParams.el_lifestealHealed = relativeDamage;
                    relativeDamage -= adjustedHealth;
                } else if (combatantParams.el_lifestealTimer > 0) {
                    relativeDamage = 0;
                } else {
                    combatantParams.el_lifestealHealed = relativeDamage;
                }
                relativeDamage = Math.floor(relativeDamage);
                if(relativeDamage > 0) {
                    rootCombatant.heal({value: relativeDamage, absolute: true})

                    rootCombatant.effects.death.spawnOnTarget("el_lifesteal_steal", combatant,
                        {
                            target2: this.combatant,
                            target2Align: ig.ENTITY_ALIGN.CENTER,
                            align: ig.ENTITY_ALIGN.CENTER
                        }
                    );
                    this.combatant.effects.death.spawnOnTarget("el_lifesteal_aura", this.combatant);
                    
                    combatantParams.el_lifestealTimer = lifestealCooldown;
                }
            }
            return damageResult;
        },

        reset(maxSp) {
            this.parent(maxSp);
            this.el_tricksterBuff = undefined;
            this.el_tricksterTimer = 0;
            this.el_lifestealTimer = 0;
            this.el_lifestealHealed = 0;
        }
    })

    //@ts-expect-error enums do not like being assigned values
    sc.COMBAT_PARAM_MSG.BUFF_CHANGED = Math.max(...Object.values(sc.COMBAT_PARAM_MSG)) + 1;

    sc.BuffHudEntry.inject({
        init(buff, id, x) {
            this.parent(buff, id, x);
            this.buff.buffHudEntry = this;
            //@ts-ignore
            this.textGui = this.getChildGuiByIndex(0).gui
        },

        setIcon(iconString) {
            this.textGui.setText(iconString);
            this.hook.size.x = this.textGui.hook.size.x + 6;
            sc.Model.notifyObserver(sc.model.player.params, sc.COMBAT_PARAM_MSG.BUFF_CHANGED);
        }
    })

    sc.BuffHudGui.inject({
        modelChanged(model, message, data) {
            this.parent(model, message, data);
            if(message === sc.COMBAT_PARAM_MSG.BUFF_CHANGED) this.sortSlots();
        }
    })

    sc.DynamicBuff = sc.StatChange.extend({
        active: true,
        init(name, statChanges) {
            this.name = name;
            this.parent(statChanges);
            //this.iconString = genBuffString(statChanges);
        },
        update() {
            return !this.active;
        },
        getTimeFactor() {
            return this.active ? 1 : 0;
        },
        changeStat(statChanges) {
            this.params = {
                hp: 1,
                attack: 1,
                defense: 1,
                focus: 1,
                elemFactor: [1, 1, 1, 1]
            },
            this.modifiers = {};
            //@ts-ignore
            this.init(this.name, statChanges);

            this.buffHudEntry?.setIcon(this.iconString!);
        },
    })

    ig.ENTITY.Player.inject({
        updateModelStats(a) {
            this.parent(a)
            if (this.params.getModifier("EL_LIFESTEAL") > 0) this.regenFactor = 0;
            if (this.params.getModifier("EL_TRANCE")) this.regenFactor = 0;
        },

        update() {
            this.parent();
            if (this.params.getModifier("EL_TRANCE") && sc.combat.isInCombat(this) && this.params.getHpFactor() > 0.33) {
                this.params.currentHp -= 1;
                sc.Model.notifyObserver(this.params, sc.COMBAT_PARAM_MSG.HP_CHANGED, true);
            }
        }
    })
    //#endregion

    // why write 5 functions when 1 function can do the trick? :)
    sc.DAMAGE_MODIFIER_FUNCS.EL_ELEMENT_BOOST = (attackInfo, damageFactor, combatantRoot, shieldResult, hitIgnore, params) => {
        damageFactor *= 1 + combatantRoot.params.getModifier(`EL_${numberToElementName(attackInfo.element)!}_BOOST`)

        return { attackInfo, damageFactor, applyDamageCallback: null }
    }

}