ig.ENTITY.ElementPole.inject({
    ballHit(ball) {
        let parent = this.parent(ball);

        if(ball.getElement() === sc.ELEMENT.NEUTRAL) return parent;

        if(parent && ball.el_prism.rootEntity) {
            for(const child of ball.el_prism.rootEntity.el_prism.children) {
                child.destroy();
            }
        }
        return parent;
    }
})

let orig1 = sc.ElementPoleGroups.onPoleHit.bind(sc.ElementPoleGroups);
sc.ElementPoleGroups.onPoleHit = function(pole, ball, alreadyHit) {
    return orig1(pole, ball.el_prism.rootEntity || ball, alreadyHit);
}
let orig2 = sc.ElementPoleGroups.onCancelCheck.bind(sc.ElementPoleGroups)
sc.ElementPoleGroups.onCancelCheck = function(pole) {
    let ball = this.getGroup(pole.group).currentBall;
    //let killStatus = true;
    let orig_killed = ball?._killed;
    if(ball) {
        if(ball.el_prism.children.length > 0) {
            for(let child of ball.el_prism.children) {
                if(!child._killed) {
                    ball._killed = false;
                    break;
                }
            }
        }
    }

    let val = orig2(pole);
    if(ball) ball._killed = orig_killed!;
    return val;
}
