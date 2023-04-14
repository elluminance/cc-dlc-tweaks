export {};

declare global {
    namespace sc {
        interface PlayerModel {
            el_statOverride: el.StatOverride;

            enableStatOverride(this: this, active: boolean): void;
        }
    }

    namespace el {
        namespace StatOverride {
            interface ElementBonus {
                hp: number;
                attack: number;
                defense: number;
                focus: number;
                modifiers: Partial<Record<keyof sc.MODIFIERS, number>>;
            }

            interface Constructor extends ImpactClass<StatOverride> {
                new (root: sc.PlayerModel): StatOverride;
            }
        }

        interface StatOverride extends ig.Class {
            root: sc.PlayerModel;
            hp: number;
            attack: number;
            defense: number;
            focus: number;
            modifiers: Partial<Record<keyof sc.MODIFIERS, number>>;
            spLevel: number;

            elementBonus: Record<keyof typeof sc.ELEMENT, StatOverride.ElementBonus>;

            active: boolean;

            setActive(this: this, state: boolean): void;
        }

        let StatOverride: StatOverride.Constructor;
    }
}