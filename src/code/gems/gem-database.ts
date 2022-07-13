export function integerToRomanNumeral(num: number) {
    switch(num) {
        case 1: return "I";
        case 2: return "II";
        case 3: return "III";
        case 4: return "IV";
        case 5: return "V";
        case 6: return "VI";
        default: return num.toString();
    }
}

type Gem = el.GemDatabase.Gem;

export default function () {
    el.GemDatabase = ig.Class.extend({
        guiImage: new ig.Image("media/gui/el-mod-gui.png"),
        gems: {
            FALLBACK: {
                stat: "UNKNOWN",
                costs: [0,0,0,0,0,0],
                gemColor: el.GEM_COLORS.DEFAULT,
                values: [0,0,0,0,0,0],
                order: 100000    
            }
        },
        gemInventory: [],
        equippedGems: [],
        activeBonuses: {
            params: {
                hp: 1,
                attack: 1,
                defense: 1,
                focus: 1,
                elemFactor: [1, 1, 1, 1]
            },
            modifiers: {}
        },
        maxPower: 99,
        maxSlots: 3,

        init() {
            let gemInfo = ig.database.get("el-gems");

            let values: number[];
            ig.storage.register(this);

            Object.entries(gemInfo.gemTypes).forEach(([key, gemType]) => {
                if(gemType.values) {
                    if(gemType.values.length >= 6) values = gemType.values;
                    else {
                        ig.warn(`Warning: Gem entry for ${gemType.stat} found with less than 6 values! Skipping...`);
                        return;
                    };
                } else if(gemType.valueIncrease) {
                    values = Array(6).fill(0).map(
                        (_, index) => ((index + 1) * gemType.valueIncrease!)
                    );
                } else {
                    ig.warn(`Warning: Gem entry for ${gemType.stat} found with missing values/valueIncrease! Skipping...`);
                    return;
                };

                this.gems[key] = {
                    stat: gemType.stat,
                    gemColor: el.GEM_COLORS[gemType.gemColor] ?? el.GEM_COLORS.DEFAULT,
                    values,
                    order: gemType.order,
                    costs: gemType.costs,
                }
            })
        },

        //#region Helper Functions
        gemColorToIcon(color) {
            switch(color) {
                case el.GEM_COLORS.RUBY: return "\\i[el-gem-ruby]";
                case el.GEM_COLORS.GARNET: return "\\i[el-gem-garnet]";
                case el.GEM_COLORS.DIAMOND: return "\\i[el-gem-diamond]";
                case el.GEM_COLORS.MOONSTONE: return "\\i[el-gem-moonstone]";
                case el.GEM_COLORS.CITRINE: return "\\i[el-gem-citrine]";
                case el.GEM_COLORS.TOPAZ: return "\\i[el-gem-topaz]";
                case el.GEM_COLORS.AMETHYST: return "\\i[el-gem-amethyst]";
                case el.GEM_COLORS.EMERALD: return "\\i[el-gem-emerald]";
                case el.GEM_COLORS.LAPIS_LAZULI: return "\\i[el-gem-lapis-lazuli]";
                case el.GEM_COLORS.AQUAMARINE: return "\\i[el-gem-aquamarine]";
                case el.GEM_COLORS.ONYX: return "\\i[el-gem-onyx]";
                case el.GEM_COLORS.BLOODSTONE: return "\\i[el-gem-bloodstone]";
                default: return "\\i[el-gem-default]";
            }
        },

        drawGemLevel(level, height) {
            this.guiImage.draw(6, height - 7, 23 + 8 * (level - 1), 0, 7, 5)
        },

        getGemRoot(gem) {
            return this.gems[gem.gemRoot] ?? this.gems["FALLBACK"];
        },

        getGemName(gem, withIcon, excludeLevel) {
            let specialLangEntries = ig.lang.get<Record<string, string>>("sc.gui.el-gems.special-gem-names"),
                statPart = "",
                gemRoot = this.getGemRoot(gem),
                statName = gemRoot?.stat,
                icon = withIcon ? this.gemColorToIcon(gemRoot?.gemColor) : "";
            
            if(!statName) {
                statPart = "Unknown Gem"
            } else if(statName in specialLangEntries) {
                statPart = specialLangEntries[statName]
            } else {
                statPart = ig.lang.get(`sc.menu.equip.modifier.${statName}`)
            }
            
            return excludeLevel ? `${icon}${statPart}` : `${icon}${statPart} ${integerToRomanNumeral(gem.level)}`;
        },

        getGemStatBonusString(gem, includeValue) {
            let specialLangEntries = ig.lang.get<Record<string, string>>("sc.gui.el-gems.special-stat-names");
            let workingString = "";
            const gemRoot = this.getGemRoot(gem);

            const gemStat = gemRoot.stat;

            if(gemStat in specialLangEntries) {
                workingString = specialLangEntries[gemStat];
            } else {
                workingString = ig.lang.get(`sc.menu.equip.modifier.${gemStat}`);
            };

            if(includeValue) {
                if(!sc.MODIFIERS[gemStat as keyof sc.MODIFIERS]?.noPercent) {
                    workingString += ` +${Math.round(gemRoot.values[gem.level-1] * 100)}%`
                } else {
                    workingString += ` +${gemRoot.values[gem.level-1]}`
                }
            }
            return workingString;
        },

        getGemCost(gem) {
            return this.getGemRoot(gem)?.costs[gem.level-1] || 0;
        },

        getTotalGemCosts() {
            return this.equippedGems.reduce((value, gem) => value + this.getGemCost(gem), 0);
        },

        sortGems(sortMethod) {
            let invCopy = [...this.gemInventory]
            switch(sortMethod) {
                case el.GEM_SORT_TYPE.ORDER: 
                    invCopy.sort((a, b) => {
                        let gemA = this.getGemRoot(a);
                        let gemB = this.getGemRoot(b);
                        
                        if (gemA == gemB) {
                            return b.level - a.level;
                        } else if (gemA.order == gemB.order) {
                            return this.getGemName(a, false, true).localeCompare(this.getGemName(b, false, true));
                        } else {
                            return gemA.order - gemB.order;
                        }
                    })
                    break;
                case el.GEM_SORT_TYPE.LEVEL:
                    invCopy.sort((a, b) => {
                        let result = b.level - a.level;
                        if(result == 0) {
                            result = this.getGemName(a, false, true).localeCompare(this.getGemName(b, false, true));
                        }
                        return b.level - a.level;
                    })    
                    break;
                case el.GEM_SORT_TYPE.NAME:
                    invCopy.sort((a, b) => {
                        let nameA = this.getGemName(a, false, true),
                            nameB = this.getGemName(b, false, true),
                            result = nameA.localeCompare(nameB);
                        if (result == 0) result = b.level - a.level;
                        return result;
                    })
                    break;
                case el.GEM_SORT_TYPE.COST:
                    invCopy.sort((a, b) => {
                        let result = this.getGemCost(b) - this.getGemCost(a);
                        if(result == 0) {
                            result = this.getGemName(a, false, true).localeCompare(this.getGemName(b, false, true));
                        }
                        return result;
                    })
            }

            return invCopy;
        },
        //#endregion

        //#region Gem Inventory
        createGem(gemRoot, level) {
            level ??= 1;
            
            if(!(gemRoot in this.gems)) {
                console.warn(`Unknown gem ${gemRoot}!`);
                return;
            }
            let newGem: Gem = {
                gemRoot,
                level
            };

            this.addGem(newGem);
        },

        addGem(gem) {
            this.gemInventory.push(gem);
        },

        removeGem(gem) {
            this.gemInventory.erase(gem);
        },

        compileGemBonuses() {
            let bonuses: el.GemDatabase.ParamBonuses = {
                params: {
                    hp: 1,
                    attack: 1,
                    defense: 1,
                    focus: 1,
                    elemFactor: [1, 1, 1, 1, 1]
                },
                modifiers: {}
            };

            for(const gem of this.equippedGems) {
                const root = this.getGemRoot(gem);
                const gemLevel = gem.level - 1;

                if(!root) continue;

                switch(root.stat) {
                    case "STAT_MAXHP":
                        bonuses.params.hp += root.values[gemLevel];
                        break;
                    case "STAT_ATTACK":
                        bonuses.params.attack += root.values[gemLevel];
                        break;
                    case "STAT_DEFENSE":
                        bonuses.params.defense += root.values[gemLevel];
                        break;
                    case "STAT_FOCUS":
                        bonuses.params.focus += root.values[gemLevel];
                        break;
                    case "NEUTRAL_RESIST":
                        bonuses.params.elemFactor[0] -= root.values[gemLevel];
                        break;
                    case "HEAT_RESIST":
                        bonuses.params.elemFactor[1] -= root.values[gemLevel];
                        break;
                    case "COLD_RESIST":
                        bonuses.params.elemFactor[2] -= root.values[gemLevel];
                        break;
                    case "SHOCK_RESIST": 
                        bonuses.params.elemFactor[3] -= root.values[gemLevel];
                        break;
                    case "WAVE_RESIST": 
                        bonuses.params.elemFactor[4] -= root.values[gemLevel];
                        break;
                    default:
                        if(root.stat in sc.MODIFIERS){
                            if(!(root.stat in bonuses.modifiers)) bonuses.modifiers[root.stat] = 1;

                            bonuses.modifiers[root.stat] += root.values[gemLevel]
                        }
                        break;
                }
            }
            //no elemental absorption for you >:)
            bonuses.params.elemFactor = bonuses.params.elemFactor.map(factor => Math.max(0, factor));


            sc.model.player.params.elGemBonuses = bonuses; 
        },

        equipGem(gem) {
            const gemRoot = this.getGemRoot(gem);
            let matchIndex = this.equippedGems.findIndex(
                equip => this.getGemRoot(equip)?.stat == gemRoot?.stat
            );
            
            if (matchIndex == -1 && this.equippedGems.length >= this.maxSlots) {
                return false;
            }

            let newCost = this.getTotalGemCosts() + this.getGemCost(gem);
            if(matchIndex !== -1) {
                newCost -= this.getGemCost(this.equippedGems[matchIndex]);
            }
            if(newCost > this.maxPower) {
                return false;
            }

            if(matchIndex == -1) {
                this.equippedGems.push(gem);
            } else {
                this.gemInventory.push(this.equippedGems[matchIndex]);
                this.equippedGems[matchIndex] = gem;
            }
            this.compileGemBonuses();
            sc.Model.notifyObserver(sc.model.player.params, sc.COMBAT_PARAM_MSG.STATS_CHANGED);
            return true;
        },
        
        dequipGemByIndex(index) {
            this.compileGemBonuses();
            sc.Model.notifyObserver(sc.model.player.params, sc.COMBAT_PARAM_MSG.STATS_CHANGED);
            return this.equippedGems.splice(index, 1)[0];
        },
        //#endregion
        
        //#region Storage
        onStorageSave(savefile) {
            if(!savefile.vars.storage.el) savefile.vars.storage.el = {};
            Object.assign(savefile.vars.storage.el.gems, {
                inventory: this.gemInventory,
                equipped: this.equippedGems,
            });
        },

        onStoragePreLoad(savefile) {
            const gemData = {...savefile.vars.storage?.el?.gems} as const;

            this.gemInventory = gemData?.inventory ?? [];
            this.equippedGems = gemData?.equipped ?? [];
            
            this.compileGemBonuses();
        }
        //#endregion
    })
}