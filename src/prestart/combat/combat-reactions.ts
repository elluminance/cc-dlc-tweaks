
let VirusBuffAction = new ig.Action("_EL_VirusBuff_Collab", [
    {
        value: "MASSIVE",
        type: "SET_HIT_STABLE"
    },{
        type: "WAIT_UNTIL",
        condition: "entity.collab.var.gather"
    },{
        type: "SET_TEMP_TARGET",
        kind: "COLLAB_ENTITY"
    },{
        entityType: "SELF",
        type: "SET_COLLAB_ENTITY"
    },{
        value: 1.5,
        type: "SET_RELATIVE_SPEED"
    },{
        maxTime: 2,
        forceTime: false,
        distance: 80,
        planOnly: false,
        targetType: "TARGET",
        precise: false,
        type: "NAVIGATE_TO_TARGET"
    },{
        value: 0,
        type: "SET_DAMAGE_FACTOR"
    },{
        passive: "IMMUNE",
        type: "CHANGE_ENEMY_ANNOTATION"
    },{
        varName: "ready",
        changeType: "set",
        type: "CHANGE_COLLAB_VAR",
        value: 1
    },{
        type: "WAIT_UNTIL",
        condition: "entity.collab.var.done"
    }
])
VirusBuffAction.hint = "battle";

sc.ENEMY_REACTION.EL_VIRUS_BUFF = sc.ENEMY_REACTION.COLLAB.extend({
    init(name, data) {


        data.collabKey = "el_VirusBuff";
        data.action ??= "_EL_VirusBuff_Collab";

        data.conditions ??= [];
        data.conditions.push({
            type: "!HAS_PROXY",
            group: "virus_buff"
        });
        this.parent(name, data);
    }
})

sc.EnemyType.inject({
    onload(data) {
        this.parent(data);

        for(let reaction in this.reactions) {
            if(this.reactions[reaction].type === "EL_VIRUS_BUFF") {
                this.actions["_EL_VirusBuff_Collab"] = VirusBuffAction;
                //easier than the alternatives tbh
                this.reactions[reaction].type = "COLLAB";
                break;
            }
        }
    }
})