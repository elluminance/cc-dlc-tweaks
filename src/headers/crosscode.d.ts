declare namespace ig {
    namespace ACTION_STEP {
        interface EL_SET_TARGET extends ig.ActionStepBase {
            name: string;
        }
        interface EL_SET_TARGET_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET> {

        }
        var EL_SET_TARGET: EL_SET_TARGET_CONSTRUCTOR;

        

        interface EL_SET_TARGET_POS extends ig.ActionStepBase {
            newPos: coordinates3D
            random: boolean
            randRange: coordinates2D
        }
        interface EL_SET_TARGET_POS_CONSTRUCTOR extends ImpactClass<EL_SET_TARGET_POS>{}

        var EL_SET_TARGET_POS: EL_SET_TARGET_POS_CONSTRUCTOR;
    }
    
    namespace ActionStepBase {
        
    }

    interface coordinates2D {
        x: number
        y: number
    }
    interface coordinates3D extends coordinates2D{
        z: number
    }

    interface ActionConstructor{
        getVec3(a: coordinates3D, b: ig.ActorEntity, c: Vec3): Vec3
    }

    interface ActorEntity {
        getTarget(): ig.ActorEntity
        setPos(x: number, ): void
    }
}

declare namespace sc {
    interface CrossCode {
        getEntityByName(name: string): ig.Entity
    }
}