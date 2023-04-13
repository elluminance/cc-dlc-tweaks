export {};

declare global {
    namespace sc {
        namespace PlayerModel {
            interface el_StatOverrideElementBonus {
                hp: number;
                attack: number;
                defense: number;
                focus: number;
                modifiers: Partial<Record<keyof sc.MODIFIERS, number>>;
            }

            interface el_StatOverride {
                hp: number;
                attack: number;
                defense: number;
                focus: number;
                modifiers: Partial<Record<keyof sc.MODIFIERS, number>>;
                spLevel: number;


                elementBonus: Record<keyof typeof sc.ELEMENT, el_StatOverrideElementBonus>;

                active: boolean;
            }
        }
        interface PlayerModel {
            el_statOverride: PlayerModel.el_StatOverride;

            enableStatOverride(this: this, active: boolean): void;
        }
    }
}