import { getColorFromPercent } from "../../helper-funcs.js";

export default function () {
    sc.HpHudBarGui.inject({
        updateDrawables(renderer) {
            this.parent(renderer);

            let hpRatio = this.currentHp / this.maxHp,
                targetRatio = this.targetHp / this.maxHp;
            if (hpRatio > 1 || targetRatio > 1) {
                for (let i = 1; i < hpRatio; i++) {
                    let isFullCurrent = (hpRatio - i >= 1) || (hpRatio % 1 == 0),
                        isEmptyCurrent = (hpRatio - i < 0),
                        isFullTarget = (targetRatio - i >= 1) || (targetRatio % 1 == 0),
                        isEmptyTarget = (targetRatio - i) < 0,
                        color = getColorFromPercent(245, 210, i - 1),
                        widthWhite: number,
                        widthColor: number,
                        useWhite = true;

                    if (this.targetHp < this.currentHp) {
                        widthWhite = isFullCurrent ? 1 : isEmptyCurrent ? 0 : ((this.currentHp / this.maxHp) % 1);
                        widthColor = isFullTarget ? 1 : isEmptyTarget ? 0 : ((this.targetHp / this.maxHp) % 1);
                    } else {
                        widthWhite = isFullTarget ? 1 : isEmptyTarget ? 0 : ((this.targetHp / this.maxHp) % 1);
                        widthColor = isFullCurrent ? 1 : isEmptyCurrent ? 0 : ((this.currentHp / this.maxHp) % 1);
                        useWhite = false;
                    }
                    for (let j = 0; j < this.height; j++) {
                        if (widthWhite && this.targetHp != this.currentHp) {
                            useWhite || renderer.addColor(color, j, j, widthWhite * this.width, 1)
                            renderer.addColor("#fff", j, j, widthWhite * this.width, 1).setAlpha(useWhite ? 0.9 : 0.75)
                        }
                        renderer.addColor(color, j, j, widthColor * this.width, 1)
                    }
                }
            }
        }
    })
}