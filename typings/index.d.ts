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

type ComponentSize = 'sm' | 'md' | 'lg';
type ComponentColor = 'primary'|'default';

interface BaseComponentProps{
    className?: string;
    style?: React.CSSProperties;
}