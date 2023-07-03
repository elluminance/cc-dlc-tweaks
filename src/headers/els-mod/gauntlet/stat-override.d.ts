export {};

declare global {
    namespace sc {
        interface PlayerModel extends el.StatOverride.SupportsOverride {}
        interface PartyMemberModel extends el.StatOverride.SupportsOverride {}
    }

    namespace el {
        namespace StatOverride {
            interface ElementBonus {
                hp: number;
                attack: number;
                defense: number;
                focus: number;
                modifiers: sc.ModifierList;
            }

            interface Constructor extends ImpactClass<StatOverride> {
                new (stats: StatOverride.OverrideEntry): StatOverride;
            }

            interface OverrideEntry {
                hp: number;
                attack: number;
                defense: number;
                focus: number;
                modifiers?: sc.ModifierList;
                spLevel?: number;
            }

            interface StatModification {
                hp?: number;
                attack?: number;
                defense?: number;
                focus?: number;
            }



            interface SupportsOverride {
                statOverride?: Optional<el.StatOverride>;
    
                //el_enableStatOverride(this: this, active: boolean): void;
                el_updateStatOverride(this: this): void;
            }

            type UpdateMode = "add" | "set" | "mul";
        }

        interface StatOverride extends ig.Class {
            roots: Set<StatOverride.SupportsOverride>;
            hp: number;
            attack: number;
            defense: number;
            focus: number;
            modifiers: sc.ModifierList;
            spLevel?: number;

            elementBonus: Record<keyof typeof sc.ELEMENT, StatOverride.ElementBonus>;

            active: boolean;

            setActive(this: this, state: boolean): void;
            applyOverride(this: this, override: StatOverride.OverrideEntry): void;
            updateStats(this: this, stats: StatOverride.StatModification, changeMode?: StatOverride.UpdateMode, factor?: number): void;
            addModel(this: this, model: el.StatOverride.SupportsOverride): void;
            removeModel(this: this, model: el.StatOverride.SupportsOverride): void;
            changeSp(this: this, newValue: number): void;
            addSp(this: this, value: number): void;

            _updateModifications(this: this): void;
            getBaseParams(this: this, element?: keyof typeof sc.ELEMENT): sc.CombatParams.BaseParams;
            getModifiers(this: this, element?: keyof typeof sc.ELEMENT): sc.ModifierList;
        }

        let StatOverride: StatOverride.Constructor;
    }
}