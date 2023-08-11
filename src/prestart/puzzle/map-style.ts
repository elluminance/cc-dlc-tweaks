ig.MapStyle.registerStyle("el-rhombus-lab", "map", {
    sheet: "media/entity/style/el-rhombus-lab-map.png",
    hasDoorMat: true,
    teleportField: {
        x: 0,
        y: 160,
        xCount: 3,
        zHeight: 0
    }
})

ig.MapStyle.registerStyle("el-rhombus-lab", "puzzle", {
    sheet: "media/entity/style/el-rhombus-lab-puzzle.png"
})
ig.MapStyle.registerStyle("el-rhombus-lab", "puzzle2", {
    sheet: "media/entity/style/el-rhombus-lab-puzzle2.png"
})

ig.MapStyle.registerStyle("el-rhombus-lab", "walls", {
    colors: {
        blockFront: "#475ae2",
        blockTop: "#d9eeff",
        pBlockFront: "#67fc69",
        pBlockTop: "#bafcbb",
        npBlockFront: "#eb8835",
        npBlockTop: "#fff7e5"
    },
    alpha: 0.7
})

ig.MapStyle.registerStyle("el-rhombus-lab", "waveblock", {
    sheet: "media/map/el-rhombus-lab.png",
    x: 287,
    y: 336,
})

ig.MapStyle.registerStyle("default", "waveblock_prismcopy", {
    sheet: "media/map/el-rhombus-lab.png",
    x: 352,
    y: 448,
})