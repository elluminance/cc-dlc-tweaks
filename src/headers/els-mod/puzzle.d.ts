export {}

declare global {
    namespace ig.ENTITY {
        namespace EL_Prism {
            interface Settings extends ig.Entity.Settings {
                condition: string;
            }
        }
        interface EL_Prism extends ig.AnimatedEntity {
            timer: number;
            state: number;
            animTimer: number;
            animIndex: number;
            hoverTimer: number;

            condition: ig.VarCondition;
            angle: number;
            effects: Record<"puzzle", ig.EffectSheet>
            gfx: ig.Image;
            
            active: boolean;

            ballHit(this: this, entity: ig.Entity): boolean | void;
            isBallAdjust(this: this): boolean;
        }
        interface EL_PrismConstructor extends ImpactClass<EL_Prism> {
            new(x: number, y: number, z: number, settings: EL_Prism.Settings): EL_Prism;
        }
        let EL_Prism: EL_PrismConstructor;
    }
}