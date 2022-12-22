sc.CombatProxyEntity.inject({
    init(x, y, z, settings) {
        this.parent(x, y, z, settings);
        let data = settings.data;
        if(data.animSheet) {
            this.animSheet = new ig.AnimationSheet(data.animSheet);
            if(data.walkAnims) {
                this.storeWalkAnims("default", data.walkAnims)
            } else {
                this.storeWalkAnims("default", {
                    idle: "default"
                })
            }
            this.setWalkAnims("default");
            
            if(data.startAnim) {
                this.setCurrentAnim(data.startAnim, true, null)
                this.animationFixed = true;
            }
        }
    }
})

ig.ActorEntity