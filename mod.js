import "./js/chest-counters.js"

import "./js/booster.js"

import "./js/action-step.js"

import "./js/sidwell-workaround.js"

sc.Arena.inject({
    init(){
        this.parent()
        this.registerCup('sidwell', {order: 100, id: "sidwell"});
    }
})