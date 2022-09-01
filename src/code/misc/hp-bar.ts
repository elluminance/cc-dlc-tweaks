//the first few colors of the HP bar
const DEFAULT_COLORS = [
    "#3281ff",
    "#b348ff",
    "#ff78a9",
    "#c93737",
    "#ff8100",
    "#ffe52c",
]

// a seed for the random number generator.
const COLOR_SEED_R = 37;
const COLOR_SEED_G = 178;
const COLOR_SEED_B = 17;

/*
 *  rather than use a fixed loop of colors, i thought it was a better idea to 
 *  implement a primitive random number generator that used a fixed seed.
 *  plus - i just think it is fancier is all.
 *  probably not the greatest RNG out there, but it's not meant to be.
 *  it does what it does and it works fine for what it is!
 *  in theory - it likely won't really be used. i don't even see it going beyond the first 2 colors.
 *  but, hey - i'd rather have something in place than nothing at all!
 */
function genColor(index: number) {
    //subtracts 1 so that it works with the array indexing
    index -= 1;
    
    if(index < DEFAULT_COLORS.length) {
        return DEFAULT_COLORS[index];
    } else {
        //returns a random hex color string of the form #RRGGBB. y'know, like standard RGB.
        return `#${(
              ((COLOR_SEED_R * index + COLOR_SEED_G + COLOR_SEED_B) % 0xff << 16)
            + ((COLOR_SEED_G * index + COLOR_SEED_R + COLOR_SEED_B) % 0xff << 8 )
            + ((COLOR_SEED_B * index + COLOR_SEED_R + COLOR_SEED_G) % 0xff)
        ).toString(16).padStart(6, "0")}`;        
    }
}

export function DrawHpBar(renderer: ig.GuiRenderer, currentValue: number, targetValue: number, maxValue: number, width: number, height: number, x = 0, y = 0): void { 
    let hpRatio = currentValue / maxValue,
        targetRatio = targetValue / maxValue,
        maxRatio = Math.max(hpRatio, targetRatio);
    if (hpRatio > 1) {
        for (let i = Math.max(Math.floor(maxRatio) - 2, 1); i < maxRatio; i++) {
            let isFullCurrent = i <= (hpRatio - 1),
                isEmptyCurrent = i > hpRatio,
                isFullTarget = i <= (targetRatio - 1),
                isEmptyTarget = i > targetRatio,
                color = genColor(i),
                widthWhite: number,
                widthColor: number,
                useWhite = true;

            if (targetValue < currentValue) {
                widthWhite = isFullCurrent ? 1 : isEmptyCurrent ? 0 : (hpRatio % 1);
                widthColor = isFullTarget ? 1 : isEmptyTarget ? 0 : (targetRatio % 1);
            } else {
                widthWhite = isFullTarget ? 1 : isEmptyTarget ? 0 : (targetRatio % 1);
                widthColor = isFullCurrent ? 1 : isEmptyCurrent ? 0 : (hpRatio % 1);
                useWhite = false;
            }
            for (let j = 0; j < height; j++) {
                if (widthWhite && targetValue != currentValue) {
                    useWhite || renderer.addColor(color, x + j, y + j, widthWhite * width, 1)
                    renderer.addColor("#fff", x + j, y + j, widthWhite * width, 1).setAlpha(useWhite ? 0.75 : 0.6)
                }
                renderer.addColor(color, x + j, y + j, widthColor * width, 1)
            }
        }
    }
}

export default function () {
    sc.HpHudBarGui.inject({
        updateDrawables(renderer) {
            this.parent(renderer);
            DrawHpBar(renderer, this.currentHp, this.targetHp, this.maxHp, this.width, this.height);
        }
    })

    sc.ItemStatusDefaultBar.inject({
        updateDrawables(renderer) {
            this.parent(renderer)
            if(this.type === sc.MENU_BAR_TYPE.HP) {
                DrawHpBar(renderer, this.currentValue, this.targetValue, this.maxValue, 119, 4, 2, 9)
            }
        }
    })
}