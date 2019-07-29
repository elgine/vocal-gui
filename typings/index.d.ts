interface Dictionary<T> {[i: string]: T}
type AnyOf<T> = {
    [K in keyof T]?: T[K];
};

type TypedArray = Int8Array | Uint8Array |
Int16Array | Uint16Array |
Int32Array | Uint32Array |
BigInt64Array | BigUint64Array |
Float32Array | Float64Array;

type ExportFormatMP3 = 'MP3';
type ExportFormatWAV = 'WAV';
type ExportFormatM4A = 'M4A';
type ExportFormat = ExportFormatMP3 | ExportFormatWAV | ExportFormatM4A;

type MessageTypeSuccess = 'SUCCESS';
type MessageTypeError = 'ERROR';
type MessageTypeInfo = 'INFO';
type MessageTypeWarning = 'WARNING';
type MessageType = MessageTypeSuccess | MessageTypeError | MessageTypeInfo | MessageTypeWarning;

interface Message{
    msgType: MessageType;
    msg: string;
}

type SourceTypeLocal = 'LOCAL';
type SourceTypeUrl = 'URL';
type SourceTypeMic = 'MIC';
type SourceType = SourceTypeLocal | SourceTypeUrl | SourceTypeMic;

interface ExportParams{
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