import { intToRomanNum } from "../../helper-funcs.js";

el.GEM_COLORS = {
    DEFAULT: 0,
    RUBY: 1,
    GARNET: 2,
    DIAMOND: 3,
    MOONSTONE: 4,
    CITRINE: 5,
    TOPAZ: 6,
    AMETHYST: 7,
    EMERALD: 8,
    LAPIS_LAZULI: 9,
    AQUAMARINE: 10,
    ONYX: 11,
    BLOODSTONE: 12,
}

type Gem = el.GemDatabase.Gem;

el.GemDatabase = ig.Class.extend({
    guiImage: new ig.Image("media/gui/el-mod-gui.png"),
    gemRoots: {
        FALLBACK: {
            stat: "UNKNOWN",
            gemColor: el.GEM_COLORS.DEFAULT,
            levels: {
                0: {
                    cost: 0,
                    value: 0,
                }
            },
            order: 100000,
            numberStyle: "NONE",
            shortDesc: "??????????",
        }
    },
    gemInventory: {},
    equippedGems: [],
    maxPower: 99,
    maxSlots: 3,
    enabled: false,
    bonusPower: 0,
    bonusSlots: 0,

    init() {
        let gemInfo = ig.database.get("el-gems");

        ig.storage.register(this);
        let order = 0;
        for(let [key, gemType] of Object.entries(gemInfo.gemTypes)) {
            let levels: Record<number, el.GemDatabase.TierData> = {};

            for(let data of gemType.tiers) {
                levels[data.level] = {
                    value: data.value,
                    cost: data.cost,
                }
            }

            this.gemRoots[key] = {
                stat: gemType.stat,
                gemColor: el.GEM_COLORS[gemType.gemColor] ?? el.GEM_COLORS.DEFAULT,
                numberStyle: gemType.numberStyle ?? "PERCENT",
                order: gemType.order ?? order++,
                langLabel: gemType.langLabel,
                statLangLabel: gemType.statLangLabel,
                shortDesc: gemType.shortDesc ? ig.LangLabel.getText(gemType.shortDesc) : undefined,
                levels,
            }
        }

        ig.vars.registerVarAccessor("el-gems", this);
        
        this.specialGemNameEntries = ig.lang.get("sc.gui.el-gems.special-gem-names");
    },

    _validateData() {
        this.maxSlots = Math.min(3 + this.bonusSlots, 7);
        this.maxPower = Math.floor(sc.model.player.level / 2) + this.bonusPower;

        let i = 0, powerSum = 0;
        let removedGems: Gem[] = [];
        while (i < this.equippedGems.length) {
            powerSum += this.getGemCost(this.equippedGems[i]);
            if (
                //removes excess gems
                i >= this.maxSlots
                //removes invalid gems
                && !this.isValidGem(this.equippedGems[i])
                //removes gems over the limit
                && powerSum <= this.maxPower
            ) {
                powerSum -= this.getGemCost(this.equippedGems[i]);
                removedGems.push(this.dequipGemByIndex(i)!);
            } else i++;
        }

        if(removedGems.length > 0) {
            ig.game.addTeleportMessage(ig.lang.get("sc.gui.el-gems.gem-update-warning"))
        }
        this.compileGemBonuses();
    },

    onVarAccess(_path, keys) {
        if (keys[0] === "el-gems") {
            switch (keys[1]) {
                case "active": return this.enabled;
                default:
                    if (keys[1] in this.gemRoots) {
                        switch (keys[2]) {
                            case "name":
                                return this.getGemRootName(keys[1], true);
                            case "nameWithIcon":
                                return this.getGemRootName(keys[1], true);
                        }
                    }
                    break;
            }
        }
    },

    //#region Helper Functions
    gemColorToIcon(color) {
        switch (color) {
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
        this.guiImage.draw(6, height - 7, 23 + 8 * level.limit(0, 6), 0, 7, 5)
    },

    getGemRoot(gem) {
        if(typeof gem == "string") {
            return gem in this.gemRoots ? this.gemRoots[gem] : this.gemRoots["FALLBACK"];
        } else {
            return this.gemRoots[gem.gemRoot] ?? this.gemRoots["FALLBACK"];
        }
    },

    getGemRootName(gemRoot, withIcon) {
        if (typeof gemRoot === "string") {
            gemRoot = this.gemRoots[gemRoot] ?? this.gemRoots["FALLBACK"];
        }

        let workingString = withIcon ? this.gemColorToIcon(gemRoot.gemColor) : "";

        if (gemRoot.langLabel) {
            if (typeof gemRoot.langLabel === "string") {
                workingString += ig.lang.get(gemRoot.langLabel)
            } else {
                workingString += ig.LangLabel.getText(gemRoot.langLabel);
            }
        } else if (!gemRoot.stat) {
            workingString += "Unknown Gem";
        } else if (gemRoot.stat in this.specialGemNameEntries) {
            workingString += this.specialGemNameEntries[gemRoot.stat]
        } else {
            workingString += ig.lang.get(`sc.gui.menu.equip.modifier.${gemRoot.stat}`)
        }

        return workingString;
    },

    getGemName(gem, withIcon, excludeLevel) {
        let workingString = "";

        workingString += this.getGemRootName(this.getGemRoot(gem), withIcon);

        if (!excludeLevel && gem.level !== 0) {
            workingString += " " + intToRomanNum(this.getGemLevel(gem));
        }

        return workingString;
    },

    getGemStatBonusString(gem, includeValue) {
        let specialLangEntries = ig.lang.get<Record<string, string>>("sc.gui.el-gems.special-stat-names");
        let workingString = "";
        const gemRoot = this.getGemRoot(gem);

        const gemStat = gemRoot.stat;

        if (gemRoot.statLangLabel) {
            if (typeof gemRoot.statLangLabel === "string") {
                workingString = ig.lang.get(gemRoot.statLangLabel)
            } else {
                workingString = ig.LangLabel.getText(gemRoot.statLangLabel);
            }
        } else if (gemStat in specialLangEntries) {
            workingString = specialLangEntries[gemStat];
        } else {
            workingString = ig.lang.get(`sc.gui.menu.equip.modifier.${gemStat}`);
        }

        if (includeValue) {
            let value = this.getGemStatBonus(gem);

            switch (gemRoot.numberStyle) {
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
                case "MULTIPLIER":
                    workingString += `\\i[el-gray-times]${value}`;
                    break;
                case "NONE":
                    break;
                default:
                    console.error(`Unknown gem number style ${gemRoot.numberStyle} for gem type ${gem.gemRoot}!`);
                    break;
            }
        }
        return workingString;
    },

    getGemCost(gem) {
        const root = this.getGemRoot(gem);
        return root.levels[gem.level]?.cost ?? 0;
    },

    getTotalGemCosts() {
        return this.equippedGems.reduce((value, gem) => value + this.getGemCost(gem), 0);
    },

    getGemShortDesc(gemRoot) {
        if(typeof gemRoot === "string") {
            gemRoot = this.getGemRoot(gemRoot);
        }
        if(gemRoot.shortDesc) {
            return gemRoot.shortDesc;
        } else {
            return ig.lang.get(this.getStatLangKey(gemRoot.stat, true));
        }
        
    },
    getStatLangKey(stat, isDesc) {
        let descString = "";
        if(isDesc) {
            descString = ".descriptions"
        }
        switch (stat) {
            case "STAT_MAXHP":
                return `sc.gui.menu.equip${descString}.maxhp`;
            case "STAT_ATTACK":
                return `sc.gui.menu.equip${descString}.atk`;
            case "STAT_DEFENSE":
                return `sc.gui.menu.equip${descString}.def`;
            case "STAT_FOCUS":
                return `sc.gui.menu.equip${descString}.foc`;
            case "NEUTRAL_RESIST":
                return `sc.gui.menu.equip${descString}.neutral`;
            case "HEAT_RESIST":
                return `sc.gui.menu.equip${descString}.heat`;
            case "COLD_RESIST":
                return `sc.gui.menu.equip${descString}.cold`;
            case "SHOCK_RESIST":
                return `sc.gui.menu.equip${descString}.shock`;
            case "WAVE_RESIST":
                return `sc.gui.menu.equip${descString}.wave`;
            default:
                if(!isDesc) return `sc.gui.menu.equip.modifier.${stat}`;
                else return `sc.gui.menu.equip.descriptions.${stat}`;
        }
    },

    getGemStatBonus(gem) {
        const root = this.getGemRoot(gem);
        return root.levels[gem.level]?.value ?? 0;
    },

    getGemLevel(gem) {
        return gem.level;
    },

    sortGems(sortMethod) {
        //return [];
        let orderedGems = Object.keys(this.gemInventory);

        switch (sortMethod) {
            case el.GEM_SORT_TYPE.ORDER:
                orderedGems.sort((a, b) => {
                    let gemA = this.getGemRoot(a);
                    let gemB = this.getGemRoot(b);

                    if (gemA.order === gemB.order) {
                        return this.getGemRootName(a, false).localeCompare(this.getGemRootName(b, false));
                    } else {
                        return gemA.order - gemB.order;
                    }
                })
                break;
            case el.GEM_SORT_TYPE.NAME:
                orderedGems.sort((a, b) => {
                    let nameA = this.getGemRootName(a, false),
                        nameB = this.getGemRootName(b, false),
                        result = nameA.localeCompare(nameB);
                    if (result === 0) result = this.getGemRoot(b).order - this.getGemRoot(a).order;
                    return result;
                })
                break;
        }

        return orderedGems;
    },
    //#endregion

    //#region Gem Inventory
    createGem(gemRoot, level) {
        level ??= 1;

        if (!(gemRoot in this.gemRoots)) {
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
        if(gem.gemRoot === "FALLBACK") return;
        this.gemInventory[gem.gemRoot] ??= {};
        this.gemInventory[gem.gemRoot][gem.level] ??= 0;
        this.gemInventory[gem.gemRoot][gem.level]++;
    },

    removeGem(gem) {
        if(!this.gemInventory[gem.gemRoot]?.[gem.level]) return;

        this.gemInventory[gem.gemRoot][gem.level]--;
    },

    getGemCount(gem) {
        return this.gemInventory[gem.gemRoot]?.[gem.level] ?? 0;
    },

    getTotalGemTypeCount(gemRoot) {
        if(gemRoot in this.gemInventory) {
            return Object.values(this.gemInventory[gemRoot]).reduce((prev, cur) => prev + cur);
        } else return 0
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

        for (const gem of this.equippedGems) {
            const root = this.getGemRoot(gem);
            const statBonus = this.getGemStatBonus(gem);

            if (!root) continue;

            switch (root.stat) {
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
                    if (root.stat in sc.MODIFIERS) {
                        if (!(root.stat in bonuses.modifiers)) bonuses.modifiers[root.stat] = 0;
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
            equip => this.getGemRoot(equip)?.stat === gemRoot?.stat
        );

        if (matchIndex === -1 && this.equippedGems.length >= this.maxSlots) {
            return false;
        }

        let newCost = this.getTotalGemCosts() + this.getGemCost(gem);
        if (matchIndex !== -1) {
            newCost -= this.getGemCost(this.equippedGems[matchIndex]);
        }
        if (newCost > this.maxPower) {
            return false;
        }

        if (matchIndex === -1) {
            this.equippedGems.push(gem);
            this.removeGem(gem);
        } else {
            this.addGem(this.equippedGems[matchIndex]);
            this.removeGem(gem);
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
        if (!gem) return false;
        //checks that the gem is valid
        if (!(this.isValidGem(gem))) return false;

        const gemRoot = this.getGemRoot(gem)
        //finds gems of the same type
        let gemMatch = this.equippedGems.find(equipped => (this.getGemRoot(equipped) === gemRoot));

        if (gemMatch) {
            if(gemMatch.level === gem.level) return false;
            let costDiff = this.getTotalGemCosts() - this.getGemCost(gemMatch);
            if ((costDiff + this.getGemCost(gem)) > this.maxPower) return false;
        } else {
            if (this.equippedGems.length >= this.maxSlots) return false;
            if ((this.getTotalGemCosts() + this.getGemCost(gem)) > this.maxPower) return false;
        }

        return true;
    },

    isValidGem(gem) {
        return gem.gemRoot in this.gemRoots && gem.gemRoot !== "FALLBACK" && gem.level in this.gemRoots[gem.gemRoot].levels;
    },
    //#endregion

    //#region Storage
    onStorageSave(savefile) {
        savefile.vars.storage.el ??= {}
        savefile.vars.storage.el.gems ??= {}
        

        Object.assign(savefile.vars.storage.el.gems, {
            inventory: this.gemInventory,
            equipped: this.equippedGems,

            enabled: this.enabled,
            bonusSlots: this.bonusSlots,
            bonusPower: this.bonusPower,
        })
    },

    onStoragePreLoad(savefile) {
        const gemData = { ...savefile.vars?.storage?.el?.gems } as const;

        this.gemInventory = gemData?.inventory ?? {};
        this.equippedGems = gemData?.equipped ?? [];
        this.enabled = gemData?.enabled ?? false;
        this.bonusSlots = gemData?.bonusSlots ?? 0;
        this.bonusPower = gemData?.bonusPower ?? 0;

        this._validateData();
    }
    //#endregion
})