export function numberToElementName(element: sc.ELEMENT) {
    switch(element) {
        case 0: return "NEUTRAL"
        case 1: return "HEAT"
        case 2: return "COLD"
        case 3: return "SHOCK"
        case 4: return "WAVE"
    }
} 