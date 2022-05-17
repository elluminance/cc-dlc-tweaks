import { getColorFromPercent } from "../../helper-funcs.js";

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
                color = getColorFromPercent(270, 210, i - 1),
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
            DrawHpBar(renderer, this.currentHp, this.targetHp, this.maxHp, this.width, this.height)
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