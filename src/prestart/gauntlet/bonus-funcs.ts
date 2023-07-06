el.GAUNTLET_SPECIAL_BONUS_FUNC = {};

/* eslint-disable @typescript-eslint/no-explicit-any */
type SpecialRecord = Record<string, any>;
type SpecialArray = any[];
/* eslint-enable @typescript-eslint/no-explicit-any */

Object.assign(el.GAUNTLET_SPECIAL_BONUS_FUNC, {
    statSwap(funcParams: SpecialRecord, option, runtime) {
        if(!(funcParams["stat1"] && funcParams["stat2"] && ((funcParams["value1"] && funcParams["value2"]) || funcParams["value"]))) {
            console.error("Missing value for stat1, stat2, and/or a value for function statSwap in option %s", option.key)
        }

        let value1 = 0;
        let value2 = 0;
        if(funcParams["value"]) {
            value1 = value2 = funcParams["value"];
        } else {
            value1 = funcParams["value1"];
            value2 = funcParams["value2"];
        }

        runtime.playerStatOverride!.updateStats({
            [funcParams["stat1"]]: value1,
            [funcParams["stat2"]]: -value2,
        }, "add")
    }
} as typeof el.GAUNTLET_SPECIAL_BONUS_FUNC)