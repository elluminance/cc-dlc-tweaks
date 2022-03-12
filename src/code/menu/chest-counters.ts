export default function () {
    let extraChestList = {
        "rhombus-sqr": [
            "maps.rhombusSqr/centerS.chest_888",
            "maps.rhombusSqr/centerNe.chest_5",
            "maps.rhombusSqr/centerN.chest_197",
            "maps.rhombusSqr/centerNe.chest_437",
            "maps.rhombusSqr/centerNw.chest_251",
            "maps.rhombusSqr/centerW.chest_305",
            "maps.rhombusSqr/beachSw.chest_1096"
        ],

        "bergen": [
            "maps.bergen/special/monksQuestcave3.chestGet"
        ],

        "heat-area": [
            "maps.heat/lab/roomFinal.chest_89"
        ],

        "bergen-trails": [
            "maps.bergenTrail/lab/roomFinal.chest_54"
        ],

        "autumn-fall": [
            "maps.autumn/lab/roomFinal.chest_55"
        ],

        "jungle": [
            "maps.jungle/lab/roomFinal.chest_59"
        ],

        "beach": [
            "maps.beach/temple.chest_2441"
        ],

        "final-dng": [
            "maps.finalDng/g/outdoor-01.chest_24410"
        ],
    }
    sc.MapModel.inject({
        init() {
            this.parent()
            for (let [area, chests] of Object.entries(extraChestList)) this.registerChests(area, ...chests)
        },

        isValidArea(areaName) {
            return this.areas[areaName].track
        }
    })

}