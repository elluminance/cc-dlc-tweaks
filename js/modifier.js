//#region icons
sc.MODIFIERS.EL_RISKTAKER = {
    altSheet: "media/gui/modifiers/els-mod.png",
    offX: 0,
    offY: 0,
    icon: -1,
    order: 0,
    noPercent: false
}
//#endregion icons

sc.DAMAGE_MODIFIER_FUNCS.EL_RISKTAKER = (attackInfo, damageFactor, combatantRoot, shieldResult, hitIgnore, params) => {
    // apply increased damage on the offense.
    damageFactor *= 1 + attackInfo.attackerParams.getModifier("EL_RISKTAKER")
    // doubles incoming risktaker damage
    damageFactor *= 1 + (params.getModifier("EL_RISKTAKER") * 2)
    
    return {attackInfo, damageFactor, applyDamageCallback: null}
}