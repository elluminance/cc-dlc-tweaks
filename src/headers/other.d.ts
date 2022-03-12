declare namespace sc {
    interface StatusViewCombatArtsCustomEntry extends sc.StatusViewCombatArtsEntry {
        init(this: this, artLevel: number, action: PlayerAction): void //i hate typescript sometimes.
        init(this: this, artLevel: number, action: PlayerAction, customIcon: ig.Image): void
    }
    interface StatusViewCombatArtsCustomEntryConstructor extends ImpactClass<StatusViewCombatArtsCustomEntry> { }
    var StatusViewCombatArtsCustomEntry: StatusViewCombatArtsCustomEntryConstructor;

    var DAMAGE_MODIFIER_FUNCS: Record<string, (attackInfo: sc.AttackInfo, damageFactor: number, combatantRoot: ig.ENTITY.Combatant, shieldResult: sc.SHIELD_RESULT, hitIgnore: boolean, params: sc.CombatParams) => ({ attackInfo: sc.AttackInfo, damageFactor: number, applyDamageCallback: ((...args: any[]) => void) | null })>
}

declare namespace itemAPI {
    var customItemToId: Record<string, number>
}