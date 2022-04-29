import "../../node_modules/ultimate-crosscode-typedefs/mods/item-api"
import "../../node_modules/ultimate-crosscode-typedefs/mods/modifier-api"

declare global {
    namespace sc {
        interface StatusViewCombatArtsCustomEntry extends sc.StatusViewCombatArtsEntry {}
        interface StatusViewCombatArtsCustomEntryConstructor extends ImpactClass<StatusViewCombatArtsCustomEntry> {
            new (artLevel: number, action: PlayerAction, customIcon: ig.Image): sc.StatusViewCombatArtsCustomEntry
        }
        var StatusViewCombatArtsCustomEntry: StatusViewCombatArtsCustomEntryConstructor;
    }
}