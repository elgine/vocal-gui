export default class Recorder {

    private _audioContext: AudioContext;
    private _mediaStream!: MediaStream;
    private _scriptor!: ScriptProcessorNode;
    private _mediaNode!: MediaStreamAudioSourceNode;

    constructor() {
        this._audioContext = new AudioContext();
        if (!this._audioContext) throw new Error('Can not initialize AudioContext');
    }

    async start(onProcess?: (v: Float32Array) => void) {
        if (!this._mediaStream) {
            this._mediaStream = await window.navigator.mediaDevices.getUserMedia({
                audio: true
            });
        }
        this._mediaNode = this._mediaNode || this._audioContext.createMediaStreamSource(this._mediaStream);
        this._scriptor = this._scriptor || this._audioContext.createScriptProcessor(4096, 1, 1);
        this._scriptor.onaudioprocess = (e: AudioProcessingEvent) => {
            onProcess && onProcess(e.inputBuffer.getChannelData(0).slice());
        };
        this._mediaNode.connect(this._scriptor);
        this._scriptor.connect(this._audioContext.destination);
    }

    stop() {
        if (this._mediaStream) {
            this._mediaStream.getAudioTracks()[0].stop();
        }
        if (this._scriptor) {
            this._scriptor.disconnect();
        }
        if (this._mediaNode) {
            this._mediaNode.disconnect();
        }
    }
}