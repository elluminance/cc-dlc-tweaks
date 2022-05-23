import { genBuffString } from "../../helper-funcs.js"

export default function() {
    sc.Inventory.inject({
        getBuffString(id, a, statChanges) {
            id = itemAPI.customItemToId[id] || id as number;
            if(statChanges || this.isBuffID(id)) {
                let buffString = genBuffString((statChanges || this.items[id].stats)!)

                if(!a) {
                    buffString += ` ${(this.items[id].time || 0) * (sc.newgame.get("double-buff-time") ? 2 : 1)} sec`
                }

                return buffString;
            }
        }
    })
}