sc.PlayerConfig.inject({
    onload(data) {
        this.parent(data);
        if(this.name !== "Lea") return;
        for(const type of ["ATTACK", "THROW", "DASH", "GUARD"]) {
            for(const identifier of ["1_A", "1_B", "2_A", "2_B"]) {
                this.elementConfigs[sc.ELEMENT.NEUTRAL].actions[`${type}_SPECIAL${identifier}_COPY`] =
                    this.elementConfigs[sc.ELEMENT.NEUTRAL].actions[`${type}_SPECIAL${identifier}`] ;
            }
        }
    }
})