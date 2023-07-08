el.GAUNTLET_SPECIAL_BONUS_FUNC = {};

type Params = el.GauntletController.SpecialFuncParams;

function assertParams(names: string[] | string, params: Params, funcName: string, suppressError = false) {
    let missing = false;
    if(typeof names == "string") names = [names];
    for(let name of names) {
        if(!(name in params)) {
            missing = true;
            if(!suppressError) console.error(`Warning: parameter '${name}' missing for function '${funcName}'!`);
        }
    }

    return missing;
}

Object.assign(el.GAUNTLET_SPECIAL_BONUS_FUNC, {
    statSwap(params, option, runtime) {
        if(assertParams(["stat1", "stat2"], params, "statSwap")) {
            return;
        }
        if(assertParams("value", params, "statSwap", true) && assertParams(["value1", "value2"], params, "statSwap", true)) {
            console.error("Warning: parameter 'value' (or 'value1' and 'value2') missing for function 'statSwap'")
            return;
        }

        let value1 = 0;
        let value2 = 0;
        if(params["value"]) {
            value1 = value2 = params["value"];
        } else {
            value1 = params["value1"];
            value2 = params["value2"];
        }

        runtime.playerStatOverride!.updateStats({
            [params["stat1"]]: value1,
            [params["stat2"]]: -value2,
        }, "add")
    },

    setNeutralBonus(params, option, runtime) {
        if(params.neutralOtherElemBonus) {
            runtime.playerStatOverride!.setNeutralEfficacy(params.neutralOtherElemBonus);
        }

        if(params.neutralSelfBonus) {
            runtime.playerStatOverride!.setElementUniversalBonus("NEUTRAL", params.neutralSelfBonus);
        }
    }
} as typeof el.GAUNTLET_SPECIAL_BONUS_FUNC)