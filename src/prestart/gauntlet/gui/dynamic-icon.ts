import { getEntries } from "../../../helper-funcs.js";

const MAX_WIDTH = 20;

const VanillaFoods = new ig.TileSheet("media/entity/player/item-hold.png", 16, 16, 0, 0);

function getFoodIconData(foodName: string): [ig.TileSheet, number] {
    if(foodName in sc.FOOD_SPRITE) {
        return [VanillaFoods, sc.FOOD_SPRITE[foodName]]
    } else {
        return [sc.foodAPI.getImage(foodName)!, sc.foodAPI.foodList[foodName].index]
    }
}

const vec2_tmp = Vec2.create();
const FoodIconPath = "media/gui/gauntlet-icons/item-icon.png"

el.GauntletFoodIcon = ig.Image.extend({
    cacheType: "GauntletFoodIcon",
    foodtilesheet: null,
    index: null,

    init(foodName) {
        this.parent(FoodIconPath);
        [this.foodtilesheet, this.index] = getFoodIconData(foodName);
    },

    getCacheKey(foodName) {
        return foodName;
    },

    draw(...args) {
        this.parent(...args);

        this.foodtilesheet.getTileSrc(vec2_tmp, this.index);
        
        this.foodtilesheet.image.draw(args[0]+2, args[1]+2, vec2_tmp.x, vec2_tmp.y, 16, 16);
    },
})