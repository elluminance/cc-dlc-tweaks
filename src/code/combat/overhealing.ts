export default function() {
    sc.CombatParams.inject({
        increaseHpOverheal(amount, maxOverheal) {
            let maxhp = Math.round((1 + maxOverheal) * this.getStat("hp"));
            // basically, if you already are above the maximum HP you could overheal, then do nothing. 
            if(this.currentHp > maxhp) return;
            this.currentHp = Math.min(maxhp, this.currentHp + amount);
            sc.Model.notifyObserver(this, sc.COMBAT_PARAM_MSG.HP_CHANGED)
        }
    })

    ig.ENTITY.Combatant.inject({
        ignoreOverheal: false,

        heal(healInfo, hideNumbers) {
            let {params} = this,
                {overheal} = healInfo;
            
            overheal = Math.max(overheal ?? 0, 0);

            if(params && !params.isDefeated()) {
                let totalHealValue = params.getHealAmount(healInfo),
                    normalHeal = Math.min(totalHealValue, Math.max(params.getStat("hp") * (1 + overheal) - params.currentHp, 0)),
                    overhealValue = (totalHealValue - normalHeal) / (overheal ? 2 : 4),
                    value = Math.ceil(normalHeal + overhealValue);
                params.increaseHpOverheal(value, !this.ignoreOverheal ? params.getModifier("EL_OVERHEAL") + overheal : 0);
                
                sc.arena.onCombatantHeal(this, value);
                if (sc.options.get("damage-numbers") && !hideNumbers) {
                    ig.ENTITY.HitNumber.spawnHealingNumber(this.getAlignedPos(ig.ENTITY_ALIGN.CENTER), this, value);
                }
                this.onHeal && this.onHeal(healInfo, value)
            }
        }
    })

    sc.ItemConsumption.inject({
        runHealChange(settings) {
            if(settings.overheal) {
                let player = ig.game.playerEntity,
                    healValue = (settings.value - 1) * (1 + player.params.getModifier('ITEM_BOOST'));
                player.heal({value: healValue, overheal: settings.overheal});
            } else this.parent(settings)
        }
    })

    sc.STAT_CHANGE_SETTINGS["OVERHEAL-1"] = {
        change: sc.STAT_CHANGE_TYPE.HEAL,
        type: sc.STAT_PARAM_TYPE.HEAL,
        value: 1.1,
        icon: "stat-default",
        overheal: 0.25
    }
}