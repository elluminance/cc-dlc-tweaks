export default function() {
// note: runs in poststart!

sc.StatusViewCombatArtsCustomEntry?.inject({
    init(artLevel, action, icon) {
        this.parent(artLevel, action, icon);
        if(action) {

        }
    }
})

}