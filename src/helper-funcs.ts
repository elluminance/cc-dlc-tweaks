export function numberToElementName(element: sc.ELEMENT) {
    switch(element) {
        case 0: return "NEUTRAL"
        case 1: return "HEAT"
        case 2: return "COLD"
        case 3: return "SHOCK"
        case 4: return "WAVE"
    }
}

export function rgbToString (r: number, g: number, b: number, max255 = false) {
    function to2DigStr(val: number) {
        if(val < 16) {
            return `0${val.toString(16)}`
        } else return val.toString(16)
    }
    if(max255) {
        return `#${to2DigStr(r)}${to2DigStr(g)}${to2DigStr(b)}`
    } else {
        return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
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
    const newHue = Math.min(hueAtMin, hueAtMax) + Math.abs(hueAtMax - hueAtMin) * rotPercent

    const red = Math.floor(hueToRGBValue(newHue + 120))
    const green = Math.floor(hueToRGBValue(newHue))
    const blue = Math.floor(hueToRGBValue(newHue - 120))
    return rgbToString(red, green, blue);
}

export function getColorFromPercentPlusSV(rotPercent: number, maxHue: number, minHue: number, saturation: number, value: number): string {
    let newHue = Math.min(minHue, maxHue) + Math.abs(maxHue - minHue) * rotPercent

    return hsv2rgbString(newHue, saturation, value)
}

export function hsv2rgb(h: number, s: number, v: number): [number, number, number] {                              
  let f = (n: number,k=(n+h/60)%6) => Math.round((v - v*s*Math.max( Math.min(k,4-k,1), 0)) * 255);     
  return [f(5),f(3),f(1)];
}
export function hsv2rgbString(h: number,s: number,v: number) {
    return rgbToString(...hsv2rgb(h, s, v), true);
}

const rankRegex = /stat-(?:rank|level)(-down)?-(\d+)/
export function genBuffString(buffList: string[]) {
    let buffIcons: Record<string, string[]> = {}
    for(const value of buffList) {
        let statSetting = sc.STAT_CHANGE_SETTINGS[value];
        if(statSetting.change === sc.STAT_CHANGE_TYPE.HEAL) continue;
        
        if(!buffIcons[statSetting.grade!]) buffIcons[statSetting.grade!] = [];
        
        buffIcons[statSetting.grade!].push(statSetting.icon ?? "stat-default")
    }

    let buffString = "";
    let list = Object.keys(buffIcons).sort((a, b) => {
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
    });

    for(const grade of list) {
        for(const value of buffIcons[grade]) buffString += `\\i[${value}]`;

        buffString += `\\i[${grade}]`
    }
    return buffString;
}

export function Vec3ToTuple(v: Vec3): [number,number,number] {
    return [v.x, v.y, v.z];
}

export function randint(a: number, b?: number) {
    let range = b === undefined ? a : Math.abs(b - a);
    let min = b === undefined ? 0 : Math.min(a, b);

    return Math.trunc(min + range * Math.random());
}

const romanNums = [
    [900, "CM"],
    [500, "D" ],
    [400, "CD"],
    [100, "C" ],
    [90,  "XC"],
    [50,  "L" ],
    [40,  "XL"],
    [10,  "X" ],
    [9,   "IX"],
    [5,   "V" ],
    [4,   "IV"],
    [1,   "I" ],
] as const;

export function intToRomanNum(num: number) {
    let val = Math.abs(num.toInt());
    if(val > 1000) {
        return val.toString();
    }

    let str = "";
    for(let i of romanNums) {
        while(val >= i[0]) {
            str += i[1];
            val -= i[0];
        }
    }

    return str;
}

export function getEntries<Key extends string | number | symbol, Value>(obj: {[key in Key]?: Value}): [Key, Value][] {
    return Object.entries(obj) as [Key, Value][];
}

export function safeAdd<K extends string | number | symbol>(obj: {[key in K]?: number}, key: K, val: number) {
    if(!(key in obj)) {
        obj[key] = 0;
    }
    obj[key]! += val;
}