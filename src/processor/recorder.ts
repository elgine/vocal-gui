import Signal from '../utils/signal';

const combineBuffers = (chunks: Float32Array[]) => {
    let chunkCount = chunks.length;
    if (chunkCount <= 0) return null;
    let chunkSize = chunks[0].length;
    let allCount = chunkSize * chunkCount;
    let newContainer = new Float32Array(allCount);
    chunks.forEach((buf, i) => {
        newContainer.set(buf, chunkSize * i);
    });
    return newContainer;
};

const createAudioBuffer = (ctx: AudioContext, duration: number, chunks: Float32Array[]): Promise<AudioBuffer> => {
    return new Promise((resolve, reject) => {
        let newBufContainer = combineBuffers(chunks);
        if (newBufContainer) {
            let buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
            buffer.copyToChannel(newBufContainer, 0);
            resolve(buffer);
        } else {
            reject(new Error('Buffers can not empty'));
        }
    });
};

export default class Recorder {

    public readonly onProcess: Signal = new Signal();
    private _bufferSize: number = 1024;
    private _audioContext!: AudioContext;
    private _mediaStream?: MediaStream;
    private _scriptor!: ScriptProcessorNode;
    private _mediaNode!: MediaStreamAudioSourceNode;
    private _chunks: Float32Array[] = [];
    private _duration: number = 0;
    private _buffer: AudioBuffer|null = null;

    async init(bufferSize?: number) {
        this.clear();
        this._bufferSize = bufferSize || 1024;
        this._audioContext = new AudioContext();
        if (!this._audioContext) throw new Error('Can not initialize AudioContext');
        if (!this._mediaStream) {
            this._mediaStream = await window.navigator.mediaDevices.getUserMedia({
                audio: true
            });
        }
        this._mediaNode = this._mediaNode || this._audioContext.createMediaStreamSource(this._mediaStream);
        this._scriptor = this._scriptor || this._audioContext.createScriptProcessor(this._bufferSize, 1, 1);
        this._scriptor.onaudioprocess = (e: AudioProcessingEvent) => {
            this._chunks.push(e.inputBuffer.getChannelData(0));
            this._duration += e.inputBuffer.duration;
            this.onProcess.emit(e.inputBuffer);
        };
    }

    async save() {
        this._buffer = await createAudioBuffer(this._audioContext, this._duration, this._chunks);
        this.clear();
    }

    clear() {
        this._chunks.length = 0;
        this._duration = 0;
    }

    start() {
        if (this._mediaNode && this._scriptor) {
            this._mediaNode.connect(this._scriptor);
            this._scriptor.connect(this._audioContext.destination);
        }
    }

    stop() {
        if (this._scriptor) {
            this._scriptor.disconnect();
        }
        if (this._mediaNode) {
            this._mediaNode.disconnect();
        }
    }

    dispose() {
        this.stop();
        this.clear();
        this._buffer = null;
        if (this._mediaStream) {
            this._mediaStream.getAudioTracks()[0].stop();
            this._mediaStream = undefined;
        }
    }

    get buffer() {
        return this._buffer;
    }
}