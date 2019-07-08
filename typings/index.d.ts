interface Dictionary<T> {[i: string]: T}
type AnyOf<T> = {
    [K in keyof T]?: T[K];
};

interface Size{
    width: number;
    height: number;
}

interface Point{
    x: number;
    y: number;
}

interface Segment{
    start: number;
    end: number;
}

interface BaseComponentProps{
    className?: string;
    style?: React.CSSProperties;
}

interface EffectItem{
    id: string;
    title: string;
    thumb: string;
}