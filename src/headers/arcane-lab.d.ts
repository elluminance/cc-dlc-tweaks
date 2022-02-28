declare namespace sc {
    interface StatusViewCombatArtsCustomEntry extends sc.StatusViewCombatArtsEntry {
        init(this: this, artLevel: number, action: PlayerAction): void //i hate typescript sometimes.
        init(this: this, artLevel: number, action: PlayerAction, customIcon: ig.Image): void
    }
    interface StatusViewCombatArtsCustomEntryConstructor extends ImpactClass<StatusViewCombatArtsCustomEntry> {}
    var StatusViewCombatArtsCustomEntry: StatusViewCombatArtsCustomEntryConstructor;
}