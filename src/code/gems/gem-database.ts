export function integerToRomanNumeral(num: number) {
    switch(num) {
        case 1: return " I";
        case 2: return " II";
        case 3: return " III";
        case 4: return " IV";
        case 5: return " V";
        case 6: return " VI";
        case -1: return "";
        default: return " " + num.toString();
    }
}

type Gem = el.GemDatabase.Gem;
type GemRootStandard = el.GemDatabase.GemRootStandard;
type GemRootUnique = el.GemDatabase.GemRootUnique;

export default function () {
    el.GemDatabase = ig.Class.extend({
        guiImage: new ig.Image("media/gui/el-mod-gui.png"),
        gemRoots: {
            FALLBACK: {
                stat: "UNKNOWN",
                gemColor: el.GEM_COLORS.DEFAULT,
                costs: [0,0,0,0,0,0],
                values: [0,0,0,0,0,0],
                order: 100000,
                numberStyle: "NONE",
            }
        },
        gemInventory: [],
        equippedGems: [],
        maxPower: 99,
        maxSlots: 3,

        init() {
            let gemInfo = ig.database.get("el-gems");

            let values: number[];
            ig.storage.register(this);
            let order = 0;
            Object.entries(gemInfo.gemTypes).forEach(([key, gemType]) => {
                if(gemType.values) {
                    if(gemType.values.length >= 6) values = gemType.values;
                    else {
                        ig.warn(`Warning: Gem entry for ${gemType.stat} found with less than 6 values! Skipping...`);
                        return;
                    };
                } else if(gemType.valueIncrease != undefined) {
                    values = Array(6).fill(0).map(
                        (_, index) => ((index + 1) * gemType.valueIncrease!)
                    );
                } else {
                    ig.warn(`Warning: Gem entry for ${gemType.stat} found with missing values/valueIncrease! Skipping...`);
                    return;
                };

                this.gemRoots[key] = {
                    stat: gemType.stat,
                    gemColor: el.GEM_COLORS[gemType.gemColor] ?? el.GEM_COLORS.DEFAULT,
                    values,
                    numberStyle: gemType.numberStyle ?? "PERCENT",
                    order: gemType.order ?? order++,
                    costs: gemType.costs,
                    langLabel: gemType.langLabel,
                    statLangLabel: gemType.statLangLabel,
                }
            })

            Object.entries(gemInfo.uniqueGems).forEach(([key, gemType]) => {
                this.gemRoots[key] = {
                    stat: gemType.stat,
                    gemColor: el.GEM_COLORS[gemType.gemColor] ?? el.GEM_COLORS.DEFAULT,
                    isUniqueGem: true,
                    order: gemType.order ?? order++,
                    value: gemType.value,
                    cost: gemType.cost,
                    numberStyle: gemType.numberStyle ?? "NONE",
                    levelOverride: gemType.levelOverride ?? -1,
                    langLabel: gemType.langLabel,
                    statLangLabel: gemType.statLangLabel,
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
            this.guiImage.draw(6, height - 7, 23 + 8 * (level == -1 ? 6 : (level - 1)), 0, 7, 5)
        },

        getGemRoot(gem) {
            return this.gemRoots[gem.gemRoot] ?? this.gemRoots["FALLBACK"];
        },

        getGemName(gem, withIcon, excludeLevel) {
            let specialLangEntries = ig.lang.get<Record<string, string>>("sc.gui.el-gems.special-gem-names"),
                workingString = "",
                gemRoot = this.getGemRoot(gem),
                statName = gemRoot?.stat;

            if(withIcon) workingString = this.gemColorToIcon(gemRoot?.gemColor);

            if(gemRoot.langLabel) {
                if(typeof gemRoot.langLabel == "string") {
                    workingString += ig.lang.get(gemRoot.langLabel)
                } else {
                    workingString += ig.LangLabel.getText(gemRoot.langLabel);
                }
            } else if(!statName) {
                workingString += "Unknown Gem"
            } else if(statName in specialLangEntries) {
                workingString += specialLangEntries[statName]
            } else {
                workingString += ig.lang.get(`sc.gui.menu.equip.modifier.${statName}`)
            }

            if(!excludeLevel) {
                workingString += integerToRomanNumeral(this.getGemLevel(gem));
            }

            return workingString;
        },

        getGemStatBonusString(gem, includeValue) {
            let specialLangEntries = ig.lang.get<Record<string, string>>("sc.gui.el-gems.special-stat-names");
            let workingString = "";
            const gemRoot = this.getGemRoot(gem);

            const gemStat = gemRoot.stat;

            if (gemRoot.statLangLabel) {
                if(typeof gemRoot.statLangLabel == "string") {
                    workingString = ig.lang.get(gemRoot.statLangLabel)
                } else {
                    workingString = ig.LangLabel.getText(gemRoot.statLangLabel);
                }
            } else if(gemStat in specialLangEntries) {
                workingString = specialLangEntries[gemStat];
            } else {
                workingString = ig.lang.get(`sc.gui.menu.equip.modifier.${gemStat}`);
            };

            if(includeValue) {
                let value = this.getGemStatBonus(gem);

                switch(gemRoot.numberStyle) {
                    case "PERCENT":
                        workingString += ` +${(this.getGemStatBonus(gem) * 100).round(1)}%`;
                        break;
                    case "PERCENT_PREFIX": 
                        workingString = `+${(this.getGemStatBonus(gem) * 100).round(1)}% ${workingString}`;
                        break;
                    case "NUMBER":
                        workingString += ` +${value}`
                        break;
                    case "NUMBER_PREFIX":
                        workingString = `+${value} ${workingString}`;
                        break;
                    case "PREFIX_PLUS":
                        workingString = "+" + workingString;
                        break;
                }
            }
            return workingString;
        },

        getGemCost(gem) {
            const root = this.getGemRoot(gem);
            if((root as GemRootUnique).isUniqueGem) {
                return (root as GemRootUnique).cost;
            } else {
                return (root as GemRootStandard)?.costs[gem.level-1] || 0;
            }
        },

        getTotalGemCosts() {
            return this.equippedGems.reduce((value, gem) => value + this.getGemCost(gem), 0);
        },

        getGemStatBonus(gem) {
            const root = this.getGemRoot(gem);

            if((root as GemRootUnique).isUniqueGem) {
                return (root as GemRootUnique).value;
            } else {
                return (root as GemRootStandard).values[gem.level - 1];
            }
        },
        
        getGemLevel(gem) {
            let gemRoot = this.getGemRoot(gem) as GemRootUnique;
            if(gemRoot.levelOverride != undefined) return gemRoot.levelOverride;
            return gem.level;
        },

        sortGems(sortMethod) {
            let invCopy = [...this.gemInventory];

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
                        let result = Math.max(this.getGemLevel(b), 0) - Math.max(this.getGemLevel(a), 0);
                        if(result == 0) {
                            result = this.getGemName(a, false, true).localeCompare(this.getGemName(b, false, true));
                        }
                        return result;
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
            
            if(!(gemRoot in this.gemRoots)) {
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
                const statBonus = this.getGemStatBonus(gem);

                if(!root) continue;

                switch(root.stat) {
                    case "STAT_MAXHP":
                        bonuses.params.hp += statBonus;
                        break;
                    case "STAT_ATTACK":
                        bonuses.params.attack += statBonus;
                        break;
                    case "STAT_DEFENSE":
                        bonuses.params.defense += statBonus;
                        break;
                    case "STAT_FOCUS":
                        bonuses.params.focus += statBonus;
                        break;
                    case "NEUTRAL_RESIST":
                        bonuses.params.elemFactor[0] -= statBonus;
                        break;
                    case "HEAT_RESIST":
                        bonuses.params.elemFactor[1] -= statBonus;
                        break;
                    case "COLD_RESIST":
                        bonuses.params.elemFactor[2] -= statBonus;
                        break;
                    case "SHOCK_RESIST": 
                        bonuses.params.elemFactor[3] -= statBonus;
                        break;
                    case "WAVE_RESIST": 
                        bonuses.params.elemFactor[4] -= statBonus;
                        break;
                    default:
                        if(root.stat in sc.MODIFIERS){
                            if(!(root.stat in bonuses.modifiers)) bonuses.modifiers[root.stat] = 0;
                            bonuses.modifiers[root.stat] += statBonus
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

        canEquipGem(gem) {
            if(!gem) return false;
            //checks that the gem is valid
            if(!(gem.gemRoot in this.gemRoots)) return false;
            
            const gemRoot = this.getGemRoot(gem)
            //finds gems of the same stat
            let gemMatch = this.equippedGems.find(equipped => (this.getGemRoot(equipped).stat == gemRoot.stat));
            
            if(gemMatch) {
                let costDiff = this.getTotalGemCosts() - this.getGemCost(gemMatch);
                if((costDiff + this.getGemCost(gem)) > this.maxPower) return false;
            } else {
                if(this.equippedGems.length >= this.maxSlots) return false;
            }

            return true;
        },
        //#endregion
        
        //#region Storage
        onStorageSave(savefile) {
            if(!savefile.vars.storage?.el) savefile.vars.storage.el = {gems: {}};

            savefile.vars.storage.el.gems.inventory = this.gemInventory;
            savefile.vars.storage.el.gems.equipped = this.equippedGems;
        },

        onStoragePreLoad(savefile) {
            const gemData = {...savefile.vars.storage?.el?.gems} as const;

            this.gemInventory = gemData?.inventory ?? [];
            this.equippedGems = gemData?.equipped ?? [];
            
            let i = 0;

            while (i < this.equippedGems.length) {
                // Removes invalid gems and adds to inventory
                if(!(this.equippedGems[i].gemRoot in this.gemRoots)) {
                    this.gemInventory.push(...this.equippedGems.splice(i, 1));
                } else i++;
            }

            this.compileGemBonuses();
        }
        //#endregion
    })
}