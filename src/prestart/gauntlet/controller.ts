el.GAUNTLET_MESSAGE = {
    CHANGED_STATE: 0
}

const DEFAULT_RUNTIME: Readonly<el.GauntletController.Runtime> = {
    currentCup: null,
    curPoints: 0,
    totalPoints: 0,
    curXp: 0,
    currentRound: 0,
} as const;

el.GauntletCup = ig.JsonLoadable.extend({
    enemyTypes: null,
    cacheType: "EL_GAUNTLET_CUP",

    getJsonPath() {
        return `${ig.root}${this.path.toPath("data/el-gauntlet/", ".json")}`
    },

    onload(data) {
        this.data = data;
        this.name = ig.LangLabel.getText(this.data.name);
        this.desc = ig.LangLabel.getText(this.data.description);
        this.condition = new ig.VarCondition(data.condition);

        this.enemyTypes = {};
        for(let [name, type] of Object.entries(data.enemyTypes)) {
            this.enemyTypes[name] = {
                enemyInfo: new sc.EnemyInfo(type.settings),
            }
        }
    },

    getName() {
        return this.name;        
    }
})

const DEFAULT_CUPS = ["test-gauntlet"];

el.GauntletController = ig.GameAddon.extend({
    runtime: {...DEFAULT_RUNTIME},
    active: false,
    cups: {},

    init() {
        this.parent("el-Gauntlet");
        this.registerCup(DEFAULT_CUPS)
    },

    registerCup(cupName) {
        if(Array.isArray(cupName)) {
            for(const name of cupName) {
                this.registerCup(name);
            }
        } else {
            if(cupName in this.cups) {
                console.warn(`Gauntlet: Attempt to register cup with duplicate name "${cupName}" detected!`);
                return;
            }

            this.cups[cupName] = new el.GauntletCup(cupName);
        }
    },

    startGauntlet(name) {
        this.active = true;
        this.runtime = {...DEFAULT_RUNTIME};   
        this.runtime.currentCup = this.cups[name];
        this.runtime.currentRound = 1;
        this.startNextRound();
    },

    startNextRound() {

    },

    _spawnEnemy(enemySettings, marker, level, showEffects = true) {
        let pos = {...ig.game.getEntityByName(marker.marker).coll.pos};
        pos.x += marker.offX || 0;
        pos.y += marker.offY || 0;
        pos.z += marker.offZ || 0;

        let enemyInfo = new sc.EnemyInfo({...enemySettings, level})

        enemyInfo.enemyType.load(() => {
            ig.game.spawnEntity(
                ig.ENTITY.Enemy,
                pos.x, pos.y, pos.z,
                {enemyInfo: enemyInfo.getSettings()},
                showEffects
            )
        })
    },
})


ig.addGameAddon(() => (el.gauntlet = new el.GauntletController));
