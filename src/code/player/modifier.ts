import { numberToElementName } from "../../helper-funcs.js"

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

        EL_COND_GUARD_ALL: {
            altSheet: "media/gui/modifiers/els-mod.png",
            offX: 12 * 9,
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

    //#region vampirism
    const lifestealCooldown = 1/5;
    const cooldownPower = 3;
    const cooldownConstant = lifestealCooldown ** -cooldownPower;
    const lifestealMultiplier = 0.04;

    sc.CombatParams.inject({
        el_lifestealHealed: 0,
        el_lifestealTimer: 0,

        update(inCombat) {
            this.parent(inCombat);
            this.el_lifestealTimer -= ig.system.tick;
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

                if (sc.newgame.get("sergey-hax") 
                 && !ig.vars.get("g.newgame.ignoreSergeyHax") 
                 && rootCombatant.isPlayer
                ) relativeDamage /= 4096

                // avoid division by 0
                relativeDamage = relativeDamage !== 0 ? relativeDamage / Math.log1p(relativeDamage) : 0; 
                relativeDamage *= 1 + lifesteal;
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
                    let healAmount = this.getHealAmount({value: relativeDamage, absolute: true});
                    
                    if(sc.options.get("damage-numbers")) {
                        ig.ENTITY.HitNumber.spawnHealingNumber(
                            rootCombatant.getAlignedPos(ig.ENTITY_ALIGN.CENTER, Vec3.create()), 
                            rootCombatant, 
                            healAmount
                        );
                    }
                    
                    this.increaseHp(healAmount)
    
                    //@ts-ignore
                    rootCombatant.effects.death.spawnOnTarget("el_lifesteal_steal", combatant,
                        {
                            target2: this.combatant,
                            target2Align: ig.ENTITY_ALIGN['CENTER'],
                            align: ig.ENTITY_ALIGN['CENTER']
                        }
                    );
                    //@ts-ignore
                    this.combatant.effects.death.spawnOnTarget("el_lifesteal_aura", this.combatant);
                    
                    combatantParams.el_lifestealTimer = lifestealCooldown;
                }
            }
            return damageResult;
        }
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
    //#endregion vampirism

    // why write 5 functions when 1 function can do the trick? :)
    sc.DAMAGE_MODIFIER_FUNCS.EL_ELEMENT_BOOST = (attackInfo, damageFactor, combatantRoot, shieldResult, hitIgnore, params) => {
        damageFactor *= 1 + combatantRoot.params.getModifier(`EL_${numberToElementName(attackInfo.element)!}_BOOST`)

        return { attackInfo, damageFactor, applyDamageCallback: null }
    }

}