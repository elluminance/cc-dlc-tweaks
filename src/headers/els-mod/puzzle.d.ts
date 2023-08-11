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

        interface WavePushPullBlock {
            ballAttached: ig.ENTITY.Ball[];
            lastTeleportPos: Vec3;

            el_lastSplitBlock?: Optional<el.WavePushPullBlockPrismCopy>; 
        }
    }
    namespace ig.MapStyle {
        interface MapStyleTypes {
            waveblock_prismcopy: MapStyleType.PuzzleElement;
        } 
    }
    namespace el {
        namespace WavePushPullBlockPrismCopy {
            interface Settings extends ig.ENTITY.PushPullBlock.Settings {

            }
            interface Constructor extends ImpactClass<WavePushPullBlockPrismCopy> {
                new(x: number, y: number, z: number, settings: Settings): WavePushPullBlockPrismCopy;
            }
        }
        interface WavePushPullBlockPrismCopy extends ig.ENTITY.PushPullBlock {
            effects: Record<string, ig.EffectSheet>;

            disappear(this: this): void;
        }
        let WavePushPullBlockPrismCopy: WavePushPullBlockPrismCopy.Constructor
    }
}