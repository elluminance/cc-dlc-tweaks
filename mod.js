import "./js/chest-counters.js"

import "./js/booster.js"

import "./js/action-step.js"

sc.Arena.inject({
    init(){
        this.parent()
        this.registerCup('sidwell',".\/assets\/data\/arena\/");
    }
})