export {}

declare global {
    namespace ig.ENTITY {
        namespace EL_Prism {
            interface Settings extends ig.Entity.Settings {
                condition: string;
            }
        }
        interface EL_Prism extends ig.AnimatedEntity {
            animTimer: number;
            animIndex: number;
            hoverTimer: number;

            glowTimer: number;
            glowColor: string;

            condition: ig.VarCondition;
            angle: number;
            effects: Record<"puzzle", ig.EffectSheet>
            gfx: ig.Image;
            
            active: boolean;
            forceHidePrism: boolean;
            lightHandle: Optional<ig.LightHandle>;
        }
        interface EL_PrismConstructor extends ImpactClass<EL_Prism> {
            new(x: number, y: number, z: number, settings: EL_Prism.Settings): EL_Prism;
        }
        let EL_Prism: EL_PrismConstructor;
    }
}