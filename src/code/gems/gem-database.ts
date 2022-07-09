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
        gems: {},
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

                this.gems[key] ={
                    stat: gemType.stat,
                    gemColor: el.GEM_COLORS[gemType.gemColor] ?? el.GEM_COLORS.DEFAULT,
                    values,
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
            return this.gems[gem.gemRoot];
        },

        getGemName(gem, withIcon) {
            let specialLangEntries = ig.lang.get<Record<string, string>>("sc.gui.el-gems.special-gem-names"),
                statPart = "",
                gemRoot = this.getGemRoot(gem),
                statName = gemRoot.stat,
                icon = withIcon ? this.gemColorToIcon(gemRoot.gemColor) : "";
            
            if(statName in specialLangEntries) {
                statPart = specialLangEntries[statName]
            } else {
                statPart = ig.lang.get(`sc.menu.equip.modifier.${statName}`)
            }
            
            return `${icon}${statPart} ${integerToRomanNumeral(gem.level)}`;
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
            return this.getGemRoot(gem)!.costs[gem.level-1];
        },
        //#endregion

        //#region Gem Inventory
        createGem(gemRoot, level) {
            level ??= 1;

            let newGem: Gem = {
                gemRoot,
                level
            };

            this.gemInventory.push(newGem);
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
            if(this.equippedGems.find(
                equip => this.getGemRoot(equip).stat == gemRoot.stat
            )) return false;

            this.equippedGems.push(gem);
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
            savefile.vars.storage.el.gems = {
                inventory: this.gemInventory,
                equipped: this.equippedGems,
            };
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