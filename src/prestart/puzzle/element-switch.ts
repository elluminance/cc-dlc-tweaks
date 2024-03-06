const SWITCH_ANIMATION_SUBSHEET: ig.AnimationSheet.SheetData[] = []
const elementIndexPairs: [string, number][] = [["heat", 0], ["cold", 4], ["shock", 8], ["wave", 12], ["neutral", 16]];
for(const [element, index] of elementIndexPairs) {
    SWITCH_ANIMATION_SUBSHEET.push({
        name: `${element}On`,
        frames: [20]
    }, {
        name: `${element}SwitchOff`,
        frames: [20]
    }, {
        name: `${element}SwitchOn`,
        frames: [20]
    }, {
        name: `${element}On`,
        frames: [index, index, index, index, index, index],
        framesSpriteOffset: [0, 0, 12, 0, 0, 12, 0, 0, 13, 0, 0, 14, 0, 0, 14, 0, 0, 13]
    }, {
        name: `${element}SwitchOff`,
        time: 0.04,
        repeat: false,
        frames: [index + 1, index + 2],
        framesSpriteOffset: [0, 0, 13, 0, 0, 13]
    }, {
        name: `${element}SwitchOn`,
        time: 0.04,
        repeat: false,
        frames: [index + 2, index + 3, index],
        framesSpriteOffset: [0, 0, 13, 0, 0, 13,  0, 0, 13]
    })
}

function elementIndexToName(element: sc.ELEMENT) {
    switch(element) {
        case sc.ELEMENT.NEUTRAL: return "neutral";
        case sc.ELEMENT.HEAT: return "heat";
        case sc.ELEMENT.COLD: return "cold";
        case sc.ELEMENT.SHOCK: return "shock";
        case sc.ELEMENT.WAVE: return "wave";
    }
}

ig.ENTITY.EL_ElementSwitch = ig.AnimatedEntity.extend({
    currentElement: sc.ELEMENT.NEUTRAL,
    ballDestroyer: true,
    variable: "",
    sounds: {
        hit: new ig.Sound("media/sound/battle/hit-7.ogg", 0.4),
        bing: new ig.Sound("media/sound/puzzle/switch-activate-2.ogg", 1)
    },

    init(x, y, z, settings) {
        this.parent(x, y, z, settings);

        this.coll.type = ig.COLLTYPE.VIRTUAL;
        
        this.coll.setSize(16, 16, 24);
        this.coll.setPadding(4, 4);
        this.coll.zGravityFactor = 1E3;
        this.initAnimations({
            sheet: {
                src: "media/entity/objects/el-rhombus-lab-puzzle.png",
                width: 24,
                height: 24,
                offX: 0,
                offY: 32,
                xCount: 4,
            },
            repeat: true,
            time: 0.15,
            SUB: SWITCH_ANIMATION_SUBSHEET
        });
        this.variable = settings.variable ?? "tmp.element";

        ig.vars.setDefault(this.variable, sc.ELEMENT.NEUTRAL);

        this.setCurrentAnim(`${elementIndexToName(this.currentElement)}On`);
    },
    ballHit(ball) {
        if(ball?.attackInfo.hasHint("NO_PUZZLE")) {
            return false;
        }
        sc.combat.showHitEffect(this,
            ball.getHitCenter(this),
            sc.ATTACK_TYPE.MEDIUM,
            ball.getElement(),
            false, false, true
        );
        let newElement = ball.getElement();
        ig.SoundHelper.playAtEntity(this.sounds.hit, this);
        ig.SoundHelper.playAtEntity(this.sounds.bing, this);
        if(this.currentElement !== newElement) {
            ig.vars.set(this.variable, newElement);
        }
        return true;
    },

    switchElement(element) {
        this.setCurrentAnim(`${elementIndexToName(this.currentElement)}SwitchOff`, true, undefined, true, true);        
        this.currentElement = element;
    },

    varsChanged() {
        let element = ig.vars.get<sc.ELEMENT>(this.variable);
        if(element !== this.currentElement) {
            this.switchElement(element)
        }
    },

    animationEnded(currentAnim) {
        let element = elementIndexToName(this.currentElement);
        if(currentAnim.endsWith("SwitchOff")) {
            this.setCurrentAnim(`${element}SwitchOn`, true, `${element}On`, true)
        }
    },
})