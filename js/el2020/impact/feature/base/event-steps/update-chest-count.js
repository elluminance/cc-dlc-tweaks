ig.module("el2020.impact.feature.base.event-steps.update-chest-count").requires("impact.feature.base.event-steps").defines(function(){
    ig.EVENT_STEP.UPDATE_CHEST_COUNT = ig.EventStepBase.extend({
        init: function(a){
            this.map = a.map;
            this.area = a.area;
            this.chestID = a.chestID;
            this.variable = a.variable
        },
        start: function(){
            let b = "maps." + this.map.toPath("", "").toCamel() + "." + (this.variable ?? ("chest_" + this.chestID));
            if(ig.vars.get(b)){
                sc.stats.addMap("chests", this.area, 1)
                sc.stats.addMap("chests", "total", 1)
            }
        }
    })
})