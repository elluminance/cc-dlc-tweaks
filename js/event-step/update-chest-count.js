ig.EVENT_STEP.DLCTWEAKS_ADD_TO_CHEST_COUNT = ig.EventStepBase.extend({
    init: function(a){
        this.map = a.map;
        this.area = a.area;
        this.chestID = a.chestID;
        this.chestVariable = a.chestVariable;
    },
    start: function(){
        let varPath = `maps.${this.map.toPath("", "").toCamel()}.${this.chestVariable ?? ("chest_" + this.chestID)}`;
        if(ig.vars.get(varPath)){
            ig.vars["add"](`dlctweaks.chests.${this.area}`, 1)
        }
    }
})