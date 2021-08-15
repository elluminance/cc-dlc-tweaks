import "./js/chest-counters.js"

import "./js/booster.js"

import "./js/action-step.js"

sc.Arena.inject({
    init(){
        this.parent()
        this.registerCup('dlctweaks-sidwell',".\/assets\/data\/arena\/");
    }
})