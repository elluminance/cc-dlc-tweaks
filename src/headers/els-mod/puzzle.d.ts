export {}

declare global {
    namespace ig.ENTITY {
        namespace EL_Prism {
            interface Settings extends ig.Entity.Settings {}
        }
        interface EL_Prism extends ig.AnimatedEntity {
            ballDestroyer: true;
            timer: number;
            state: number;
            animTimer: number;
            animIndex: number;
            hoverTimer: number;

            angle: number;
            effects: Record<"puzzle", ig.EffectSheet>
            gfx: ig.Image;

            ballHit(this: this, entity: ig.Entity): boolean | void;
            isBallAdjust(this: this): boolean;
            doBallAdjust(this: this): void;
        }
        interface EL_PrismConstructor extends ImpactClass<EL_Prism> {
            new(x: number, y: number, z: number, settings: EL_Prism.Settings): EL_Prism;
        }
        let EL_Prism: EL_PrismConstructor
    }
}