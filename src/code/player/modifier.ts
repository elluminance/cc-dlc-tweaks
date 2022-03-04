import { numberToElementName } from "../../helper-funcs.js"

export default function() {
//#region icons
Object.assign(sc.MODIFIERS, {
    EL_RISKTAKER: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 0,
        offY: 0,
        icon: -1,
        order: 0,
        noPercent: false
    },

    EL_LIFESTEAL: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 12,
        offY: 0,
        icon: -1,
        order: 0,
        noPercent: true
    },

    EL_GEODE_FINDER: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 24,
        offY: 0,
        icon: -1,
        order: 0,
        noPercent: false
    },

    EL_TRANCE: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 36,
        offY: 0,
        icon: -1,
        order: 0,
        noPercent: true
    },

    EL_NEUTRAL_BOOST: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 48,
        offY: 0,
        icon: -1,
        order: 0,
    },

    EL_HEAT_BOOST: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 60,
        offY: 0,
        icon: -1,
        order: 0,
    },
    
    EL_COLD_BOOST: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 72,
        offY: 0,
        icon: -1,
        order: 0,
    },

    EL_SHOCK_BOOST: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 84,
        offY: 0,
        icon: -1,
        order: 0,
    },
    
    EL_WAVE_BOOST: {
        altSheet: "media/gui/modifiers/els-mod.png",
        offX: 96,
        offY: 0,
        icon: -1,
        order: 0,
    },
})
//#endregion icons

sc.DAMAGE_MODIFIER_FUNCS.EL_RISKTAKER = (attackInfo, damageFactor, combatantRoot, shieldResult, hitIgnore, params) => {
    // apply increased damage on the offense.
    damageFactor *= 1 + attackInfo.attackerParams.getModifier("EL_RISKTAKER")
    // doubles incoming risktaker damage
    damageFactor *= 1 + Math.max((params.getModifier("EL_RISKTAKER") * 2), 0.5)
    
    return {attackInfo, damageFactor, applyDamageCallback: null}
}

//#region vampirism
const lifestealCooldown = 0.1;

// this... is very hacky.
// only works fully on the player.
sc.DAMAGE_MODIFIER_FUNCS.EL_LIFESTEAL = (attackInfo, damageFactor, combatantRoot, shieldResult, hitIgnore, params) => {
    let attackerParams = combatantRoot.params;
    let attackDmgFactor = attackInfo.damageFactor.limit(0,8)
    let playerEntity = ig.game.playerEntity;
    
    // if attack is shielded, reduce healing to a quarter.
    if(shieldResult == sc.SHIELD_RESULT.REGULAR){
        attackDmgFactor *= 0.25;
    // if attack is perfect guarded or neutralized, reduce to 0.
    }else if(shieldResult == sc.SHIELD_RESULT.NEUTRALIZE || shieldResult == sc.SHIELD_RESULT.PERFECT){
        attackDmgFactor = 0;
    }
    attackDmgFactor *= 1 + attackerParams.getModifier("HP_REGEN")

    attackDmgFactor = 1.25 * Math.log1p(attackDmgFactor)

    let healEntity = (amount: number) => {
        const healAmount = attackerParams.getHealAmount({value: amount / 200});
        sc.options.get("damage-numbers") && ig.ENTITY.HitNumber.spawnHealingNumber(combatantRoot.getAlignedPos(ig.ENTITY_ALIGN.CENTER, Vec3.create()), playerEntity, healAmount);
        attackerParams.increaseHp(healAmount)
        
        attackerParams.el_lifestealHealed = attackDmgFactor;
    }
    
    if(attackerParams.getModifier("EL_LIFESTEAL")){
        // if lifesteal cooldown is over,
        // heal based on the damage factor.
        if(attackerParams.el_lifestealTimer <= 0){
            healEntity(attackDmgFactor)
            attackerParams.el_lifestealTimer = lifestealCooldown;
        
        // if lifesteal cooldown is not done, 
        // but an attack did more than previously healed for
        // heal for the difference.
        }else if(attackerParams.el_lifestealHealed < attackDmgFactor){
            healEntity(attackDmgFactor - attackerParams.el_lifestealHealed)
            // take the midpoint of the timer and the cooldown value
            attackerParams.el_lifestealTimer = (lifestealCooldown + attackerParams.el_lifestealTimer) / 2;
        }
    }
    return {attackInfo, damageFactor, applyDamageCallback: null}
}

sc.CombatParams.inject({
    el_lifestealTimer: 0,
    el_lifestealHealed: 0,

    update(a){
        this.parent(a)
        this.el_lifestealTimer -= ig.system.ingameTick;
    }
})

ig.ENTITY.Player.inject({
    updateModelStats(a){
        this.parent(a)
        if(this.params.getModifier("EL_LIFESTEAL")) this.regenFactor = 0;
        if(this.params.getModifier("EL_TRANCE")) this.regenFactor = 0;
    },

    update() {
        this.parent();
        if(this.params.getModifier("EL_TRANCE") && sc.combat.isInCombat(this) && this.params.getHpFactor() > 0.33) {
            this.params.currentHp -= 1;
            sc.Model.notifyObserver(this.params, sc.COMBAT_PARAM_MSG.HP_CHANGED, true);
        }
    }
})
//#endregion vampirism

// why write 5 functions when 1 function can do the trick? :)
sc.DAMAGE_MODIFIER_FUNCS.EL_ELEMENT_BOOST = (attackInfo, damageFactor, combatantRoot, shieldResult, hitIgnore, params) => {
    damageFactor *= 1 + combatantRoot.params.getModifier(`EL_${numberToElementName(attackInfo.element)}_BOOST`)

    return {attackInfo, damageFactor, applyDamageCallback: null}
}

}