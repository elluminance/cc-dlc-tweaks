export default function() {
    sc.CombatParams.inject({
        increaseHpOverheal(amount, maxHeal) {
            let maxhp = Math.round(maxHeal * this.getStat("hp"));
            // basically, if you already are above the maximum HP you could overheal, then do nothing. 
            if(this.currentHp > maxhp) return;
            this.currentHp = Math.min(maxhp, this.currentHp + amount);
            sc.Model.notifyObserver(this, sc.COMBAT_PARAM_MSG.HP_CHANGED)
        }
    })

    ig.ENTITY.Combatant.inject({
        overheal(value, maxHeal) {
            let amount = this.params.getHealAmount({value}),
                hitPos = this.getAlignedPos(ig.ENTITY_ALIGN.CENTER);
            
            this.params.increaseHpOverheal(amount, maxHeal);

            if (sc.options.get("damage-numbers")) {
                ig.ENTITY.HitNumber.spawnHealingNumber(hitPos, this, amount);
            }
            //@ts-expect-error - onHeal() only exists on the player entity, not on all combatants.
            this.onHeal && this.onHeal({value}, amount)
        }
    })

    sc.ItemConsumption.inject({
        runHealChange(settings) {
            if(settings.overheal) {
                let player = ig.game.playerEntity,
                    healValue = (settings.value - 1) * (1 + player.params.getModifier('ITEM_BOOST'));
                player.overheal(healValue, settings.overheal);
            } else this.parent(settings)
        }
    })

    sc.STAT_CHANGE_SETTINGS["OVERHEAL-1"] = {
        change: sc.STAT_CHANGE_TYPE.HEAL,
        type: sc.STAT_PARAM_TYPE.HEAL,
        value: 1.1,
        icon: "stat-default",
        overheal: 1.25
    }
}