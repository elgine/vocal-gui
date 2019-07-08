import Color from 'color';

export const shade = (c: string, ratio: number) => {
    if (ratio < 0) { return Color(c).lighten(Math.abs(ratio)).string() }
    return Color(c).darken(ratio).string();
};

export const contrast = (c: string) => {
    return Color(c).isDark() ? '#fff' : '#000';
};

export const fade = (c: string, r: number) => {
    return Color(c).fade(1 - r).string();
};