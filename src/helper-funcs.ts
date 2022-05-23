export function numberToElementName(element: sc.ELEMENT) {
    switch(element) {
        case 0: return "NEUTRAL"
        case 1: return "HEAT"
        case 2: return "COLD"
        case 3: return "SHOCK"
        case 4: return "WAVE"
    }
}

export const rgbToString = (r: number, g: number, b: number) => `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`

export function hueToRGBValue(hue: number){
    hue = (hue + 360) % 360;
    let color = 0;
    if(hue < 60) color = (1/4) * hue
    else if(hue >= 60 && hue <= 180) color = 15;
    else if(hue >= 180 && hue <= 240) color = 60 - (1/4) * hue
    return color
}

export function getColorFromPercent(hueAtMax: number, hueAtMin: number, rotPercent: number): string {
    let newHue = Math.min(hueAtMin, hueAtMax) + Math.abs(hueAtMax - hueAtMin) * rotPercent

    let red = Math.floor(hueToRGBValue(newHue + 120))
    let green = Math.floor(hueToRGBValue(newHue))
    let blue = Math.floor(hueToRGBValue(newHue - 120))
    return rgbToString(red, green, blue);
}

const rankRegex = /stat-(?:rank|level)(-down)?-(\d+)/
export function genBuffString(buffList: string[]) {
    let buffIcons: Record<string, string[]> = {}
    buffList.forEach(value => {
        let statSetting = sc.STAT_CHANGE_SETTINGS[value];
        if(statSetting.change == sc.STAT_CHANGE_TYPE.HEAL) return;
        
        if(!buffIcons[statSetting.grade!]) buffIcons[statSetting.grade!] = [];
        
        buffIcons[statSetting.grade!].push(statSetting.icon ?? "stat-default")
    })

    let buffString = "";
    Object.keys(buffIcons).sort((a, b) => {
        let a_match = a.match(rankRegex),
            b_match = b.match(rankRegex);

        let a_val: number, b_val: number;
        if (a_match) {
            a_val = parseInt(a_match[2]) * (a_match[1] ? -1 : 1);
        } else a_val = 0;
        if (b_match) {
            b_val = parseInt(b_match[2]) * (b_match[1] ? -1 : 1);
        } else b_val = 0;
        return b_val - a_val
    }).forEach(grade => {
        buffIcons[grade].forEach(value => {buffString += `\\i[${value}]`})
        buffString += `\\i[${grade}]`
    })
    return buffString;
}