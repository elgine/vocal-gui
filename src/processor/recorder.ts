import Signal from '../utils/signal';

export default class Recorder {

    public readonly bufferSize: number = 1024;
    public readonly onProcess: Signal = new Signal();
    private _audioContext: AudioContext;
    private _mediaStream?: MediaStream;
    private _scriptor!: ScriptProcessorNode;
    private _mediaNode!: MediaStreamAudioSourceNode;

    constructor(bufferSize?: number) {
        this.bufferSize = bufferSize || 1024;
        this._audioContext = new AudioContext();
        if (!this._audioContext) throw new Error('Can not initialize AudioContext');
    }

    async init() {
        if (!this._mediaStream) {
            this._mediaStream = await window.navigator.mediaDevices.getUserMedia({
                audio: true
            });
        }
        this._mediaNode = this._mediaNode || this._audioContext.createMediaStreamSource(this._mediaStream);
        this._scriptor = this._scriptor || this._audioContext.createScriptProcessor(this.bufferSize, 1, 1);
        this._scriptor.onaudioprocess = (e: AudioProcessingEvent) => this.onProcess.emit(e.inputBuffer);
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
        if (this._mediaStream) {
            this._mediaStream.getAudioTracks()[0].stop();
            this._mediaStream = undefined;
        }
    }
}