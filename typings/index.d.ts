interface Dictionary<T> {[i: string]: T}
type AnyOf<T> = {
    [K in keyof T]?: T[K];
};

type ValueType<T extends keyof V, V> = V[T];

type TypedArray = Int8Array | Uint8Array |
Int16Array | Uint16Array |
Int32Array | Uint32Array |
BigInt64Array | BigUint64Array |
Float32Array | Float64Array;

type ExportFormatMP3 = 'MP3';
type ExportFormatWAV = 'WAV';
type ExportFormat = ExportFormatMP3 | ExportFormatWAV;

type MessageTypeSuccess = 'SUCCESS';
type MessageTypeError = 'ERROR';
type MessageTypeInfo = 'INFO';
type MessageTypeWarning = 'WARNING';
type MessageType = MessageTypeSuccess | MessageTypeError | MessageTypeInfo | MessageTypeWarning;

interface Message{
    native?: boolean;
    showConfirm?: boolean;
    confirmLabel?: string;
    confirmAction?: string;
    confirmParams?: any;
    msgType: MessageType;
    msg: string;
}

interface Window{
    __ELECTRON__: boolean;
    __DEV__: boolean;
}

type SourceTypeLocal = 'LOCAL';
type SourceTypeUrl = 'URL';
type SourceTypeMic = 'MIC';
type SourceType = SourceTypeLocal | SourceTypeUrl | SourceTypeMic;

interface ExportParams{
    title: string;
    path?: string;
    bitRate: number;
    format: ExportFormat;
}

interface ScrollBarProperties{
    width: number;
    trackBgColor: string;
    thumbBgColor: string;
    thumbBgColorHover: string;
    thumbBgColorActive: string;
}

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