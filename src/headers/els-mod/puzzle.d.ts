export {}

declare global {
    namespace ig.ENTITY {
        //#region Prism
        namespace EL_Prism {
            interface Settings extends ig.Entity.Settings {
                condition: string;
            }

            //type SpawnCallback<E extends ig.Entity> = (pos: Vec3, vel: Vec2) => E;
            //type PostSpawnCallback<E1 extends ig.Entity, E2 extends ig.Entity> = (newEntity: E1, oldEntity: E2) => void;

            interface SplittablePrismData<T extends ig.Entity> {
                timer: number;
                lastPrism: ig.ENTITY.EL_Prism;
                rootEntity: Optional<T>;
                children: T[];
                glowColor: string | ((entity: T) => string);

                directRoot: Optional<T>;
                directChildren: ig.Entity[];
            }

            interface Splittable<T extends ig.Entity = ig.Entity> {
                el_prism: SplittablePrismData<T>;

                prismSpawnFunc?(this: this, prism: ig.ENTITY.EL_Prism, pos: Vec3, vel: Vec3): SplittableEntity<T>;
                onPrismSpawn?(this: this, prism: ig.ENTITY.EL_Prism, root: SplittableEntity<T>): void;
                postPrismSplit?(this: this, prism: ig.ENTITY.EL_Prism): void;
                getPrismGlowColor?(this: this): string;
            }

            type SplittableEntity<T extends ig.Entity = ig.Entity> = T & Splittable<T>
        }
        interface EL_Prism extends ig.AnimatedEntity {
            animTimer: number;
            animIndex: number;
            hoverTimer: number;
            cooldown: number;

            glowTimer: number;
            glowColor: string;

            condition: ig.VarCondition;
            angle: number;
            effects: Record<"puzzle", ig.EffectSheet>
            gfx: ig.Image;
            
            active: boolean;
            forceHidePrism: boolean;
            lightHandle: Optional<ig.LightHandle>;

            _splitEntity<E extends ig.Entity>(
                this: this,
                entity: EL_Prism.SplittableEntity<E>,
            ): EL_Prism.SplittableEntity<E>[];

            ballHit(this: this, entity: ig.ENTITY.Ball): void;
            ballHit(this: this, entity: EL_Prism.SplittableEntity): void;
        }
        interface EL_PrismConstructor extends ImpactClass<EL_Prism> {
            new(x: number, y: number, z: number, settings: EL_Prism.Settings): EL_Prism;
        }
        let EL_Prism: EL_PrismConstructor;

        interface WavePushPullBlock {
            ballAttached?: Optional<ig.ENTITY.Ball>;
            lastTeleportPos: Vec3;

            el_lastSplitBlock?: Optional<el.WavePushPullBlockPrismCopy>; 
        }

        interface Ball extends EL_Prism.Splittable<Ball> {}
        //#endregion Prism

        namespace EL_ElementSwitch {
            interface Settings extends ig.Entity.Settings {
                variable: string;

            }
        }

        interface EL_ElementSwitch extends ig.AnimatedEntity {
            currentElement: sc.ELEMENT;
            sounds: Record<string, ig.Sound>;
            variable: string;

            ballHit(this: this, ball: ig.ENTITY.Ball): boolean;
            switchElement(this: this, element: sc.ELEMENT): void;
        }
        interface EL_ElementSwitchConstructor extends ImpactClass<EL_ElementSwitch> {
            new (x: number, y: number, z: number, settings: EL_ElementSwitch.Settings): EL_ElementSwitch;
        }
        let EL_ElementSwitch: EL_ElementSwitchConstructor;
    }
    namespace ig.MapStyle {
        namespace MapStyleType {
            namespace Walls {
                interface Colors {
                    ballDestroyFront?: string;
                    ballDestroyTop?: string;
                }
            }
        }

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
        let WavePushPullBlockPrismCopy: WavePushPullBlockPrismCopy.Constructor;
    }
}