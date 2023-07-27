import { numberToElementName, randint } from "../../helper-funcs.js";

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

    EL_CRIT_BOOST: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 12 * 0,
        offY: 12,
        icon: -1,
        order: 0,
    },
    EL_LUCKY_STRIKER: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 12 * 1,
        offY: 12,
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
    damageFactor *= 1 + Math.min((params.getModifier("EL_RISKTAKER") * 2), 0.5)

    return { attackInfo, damageFactor, applyDamageCallback: null }
}

//#region
const lifestealAuraCooldown = 0.2;
const lifestealMultiplier = 0.04;



const stats = ["ATTACK", "DEFENSE", "FOCUS", "HP"]

function generateTricksterBuffs() {
    let val1 = randint(4);
    let val2: number;
    do {
        val2 = randint(4);
    } while(val2 === val1);
    return [`${stats[val1]}-3`, `EL-${stats[val2]}-MINUS-2`]
}

sc.CombatParams.inject({
    el_lifestealTimer: 0,
    el_lifestealStash: [],

    el_tricksterTimer: 0,
    el_tricksterBuff: null,

    update(inCombat) {
        this.parent(inCombat);
        this.updateLifesteal();
        this.el_lifestealTimer -= ig.system.tick;
        if (this.getModifier("EL_TRICKSTER")) {
            this.el_tricksterTimer -= ig.system.tick;
            if (this.el_tricksterTimer <= 0) {
                this.el_tricksterTimer = 11.11;
                if (this.el_tricksterBuff) {
                    this.modifyDynamicBuff(this.el_tricksterBuff, generateTricksterBuffs(), true);
                } else {
                    // 'b' in hexadecimal is '11'. in other words, the green component is 11,11. if you're gonna make a reference - go 111% of the way
                    this.el_tricksterBuff = new sc.DynamicBuff(generateTricksterBuffs(), "trickster", 11.11, "#00BB00");

                    this.addBuff(this.el_tricksterBuff);
                }
            }
        } else {
            if (this.el_tricksterBuff) {
                this.el_tricksterBuff.active = false;
                this.removeBuff(this.el_tricksterBuff);
                sc.Model.notifyObserver(this, sc.COMBAT_PARAM_MSG.BUFF_REMOVED, this.el_tricksterBuff);
                this.el_tricksterBuff = undefined;
            }
            this.el_tricksterTimer = 0;
        }
    },

    getDamage(attackInfo, damageFactorMod, combatant, shieldResult, hitIgnore) {
        let combatantRoot = combatant.getCombatantRoot(),
            combatantParams = combatantRoot.params,
            critFactor_old = attackInfo.critFactor;
        if (!ig.perf.skipDmgModifiers) attackInfo.critFactor *= (1 + combatantParams.getModifier("EL_CRIT_BOOST"));
        const damageResult = this.parent(attackInfo, damageFactorMod, combatant, shieldResult, hitIgnore);
        attackInfo.critFactor = critFactor_old;

        //#region critical
        if (!ig.perf.skipDmgModifiers && !damageResult.critical && combatantParams.getModifier("EL_LUCKY_STRIKER")) {
            damageResult.damage = Math.round(damageResult.damage / 8);
        }
        //#endregion critical

        //#region gems
        if (!ig.perf.skipDmgModifiers && this.elGemBonuses) {
            let factor = this.elGemBonuses.params.elemFactor[attackInfo.element] || 1;
            damageResult.damage *= factor;
            damageResult.damage = Math.round(damageResult.damage);
            damageResult.elementalDef *= factor;
        }
        //#endregion gems

        //#region lifesteal
        let lifesteal = combatantParams.getModifier("EL_LIFESTEAL");
        // the this.combatant !== rootCombatant is simply to make sure that any self inflicted damage (i.e. jolt)
        // does not trigger life steal. wouldn't make sense to steal from yourself, y'know?
        if (lifesteal > 0 && (this.combatant !== combatantRoot)) {
            let relativeDamage = damageResult.damage * lifestealMultiplier;


            if (combatantRoot.isPlayer) {
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
            }
            // undoes normal sergey hax
            if (combatantParams.buffs.some(buff => buff instanceof sc.ActionBuff && buff.name === "sergeyHax")) {
                relativeDamage *= combatantParams.getStat("attack", true) / combatantParams.getStat("attack", false)
            }

            // avoid division by 0, while scaling the damage dealt logarithmically
            relativeDamage *= 1 + lifesteal;

            // caps lifesteal healing at 2% max HP
            relativeDamage = Math.floor(Math.min(combatantParams.getStat("hp") / 50, relativeDamage));

            if (relativeDamage > 0) {
                // checks if a lifesteal has occured very recently to "condense" many very close hits into one to avoid number spam
                // for example - things like assault that hit very close to each other.
                if (this.el_lifestealTimer <= 0) {
                    this.el_lifestealObj = {
                        amount: relativeDamage,
                        timer: 0.6,
                    }
                    combatantParams.el_lifestealStash.push(this.el_lifestealObj);

                    sc.combat.effects.combatant.spawnOnTarget("el_lifesteal_steal", combatantRoot,
                        {
                            target2: this.combatant,
                            target2Align: ig.ENTITY_ALIGN.CENTER,
                            align: ig.ENTITY_ALIGN.CENTER
                        }
                    );
                    this.combatant.effects.death.spawnOnTarget("el_lifesteal_aura", this.combatant);
                    this.el_lifestealTimer = lifestealAuraCooldown;
                } else {
                    this.el_lifestealObj && (this.el_lifestealObj.amount += relativeDamage);
                }
            }
        }
        //#endregion lifesteal
        return damageResult;
    },

    reset(maxSp) {
        this.parent(maxSp);
        this.el_tricksterBuff = undefined;
        this.el_tricksterTimer = 0;
        this.el_lifestealTimer = 0;
    },

    removeAllBuffs() {
        this.el_tricksterTimer = 0;
        this.el_tricksterBuff = undefined;
        this.parent();
    },

    updateLifesteal() {
        let i = 0;
        while (i < this.el_lifestealStash.length) {
            let lifestealInfo = this.el_lifestealStash[i];
            lifestealInfo.timer -= ig.system.tick;

            if (lifestealInfo.timer < 0) {
                let amount = lifestealInfo.amount;
                amount = amount !== 0 ? amount / Math.log1p(amount) : 0;
                sc.combat.effects.heal.spawnOnTarget("healingLifesteal", this.combatant);
                this.combatant.heal({ value: lifestealInfo.amount, absolute: true })
                this.el_lifestealStash.splice(i, 1);
            } else i++;
        }
    },
})



ig.ENTITY.Player.inject({
    updateModelStats(a) {
        this.parent(a)
        if (this.params.getModifier("EL_LIFESTEAL") > 0) this.regenFactor /= 5;
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

