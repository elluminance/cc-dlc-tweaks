export function numberToElementName(element: sc.ELEMENT) {
    switch(element) {
        case 0: return "NEUTRAL"
        case 1: return "HEAT"
        case 2: return "COLD"
        case 3: return "SHOCK"
        case 4: return "WAVE"
    }
}

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
    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
}