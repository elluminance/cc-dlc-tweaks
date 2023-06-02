export {};

declare global {
    namespace ig.EVENT_STEP {
        namespace EL_ENABLE_STAT_OVERRIDE {
            interface Settings {
                state: boolean;
            }
            interface Constructor extends ImpactClass<EL_ENABLE_STAT_OVERRIDE> {
                new (settings: Settings): EL_ENABLE_STAT_OVERRIDE;
            }
        }
        interface EL_ENABLE_STAT_OVERRIDE extends ig.EventStepBase {
            state: boolean;
        }
        let EL_ENABLE_STAT_OVERRIDE: EL_ENABLE_STAT_OVERRIDE.Constructor;

        namespace START_EL_GAUNTLET {
            interface Constructor extends ImpactClass<START_EL_GAUNTLET> {}
        }
        interface START_EL_GAUNTLET extends ig.EventStepBase {}
        let START_EL_GAUNTLET: START_EL_GAUNTLET.Constructor;
    }
}