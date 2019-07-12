interface Dictionary<T> {[i: string]: T}
type AnyOf<T> = {
    [K in keyof T]?: T[K];
};

interface WorkerResponse{
    type: string;
    code: number;
    data?: any;
    msg?: string;
}

type TypedArray = Int8Array | Uint8Array |
Int16Array | Uint16Array |
Int32Array | Uint32Array |
BigInt64Array | BigUint64Array |
Float32Array | Float64Array;

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