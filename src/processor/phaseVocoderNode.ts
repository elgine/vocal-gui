import PhaseVocoder, { PhaseVocoderOptions } from './dsp/phaseVocoder';

export default class PhaseVocoderNode {

    private _pitch: number = 1;
    private _tempo: number = 1;

    private _delay: number = 0;
    private _delayBytes: number = 0;
    private _passedBytes: number = 0;
    private _bufferDuration: number = 0;
    private _sampleRate: number = 44100;

    private _vocoders: PhaseVocoder[] = [];
    private _node: ScriptProcessorNode;

    private _out: Float32Array;

    constructor(audioContext: BaseAudioContext, bufferSize: number = 2048, inChannels?: number, outChannels?: number) {
        this._node = audioContext.createScriptProcessor(bufferSize, inChannels, outChannels);
        this._node.onaudioprocess = this._onProcess.bind(this);
        this._out = new Float32Array(this._node.bufferSize);
        this._sampleRate = audioContext.sampleRate;
    }

    clear() {
        this._passedBytes = 0;
        this._vocoders.forEach((vocoder) => vocoder.clear());
    }

    set(options: AnyOf<PhaseVocoderOptions>) {
        if (options.pitch !== undefined) { this.pitch = options.pitch }
        if (options.tempo !== undefined) { this.tempo = options.tempo }
    }

    setBufferDuration(dur: number) {
        this._bufferDuration = dur;
        this._updateDelayBytes();
    }

    private _updateDelayBytes() {
        this._delay = (1 - this._tempo) * this._bufferDuration;
        this._delayBytes = this._delay * this._sampleRate;
    }

    private _onProcess(e: AudioProcessingEvent) {
        const { inputBuffer, outputBuffer } = e;
        const frameSize = inputBuffer.length;
        const inChannels = inputBuffer.numberOfChannels;
        const outChannels = outputBuffer.numberOfChannels;
        const vocoderCount = this._vocoders.length;
        const channels =  Math.min(inChannels, outChannels);
        for (let i = 0; i < channels; i++) {
            let vocoder: PhaseVocoder;
            if (i >= vocoderCount) {
                vocoder = new PhaseVocoder(frameSize);
                this._vocoders.push(vocoder);
            } else {
                vocoder = this._vocoders[i];
            }
            vocoder.pitch = this._pitch;
            vocoder.tempo = this._tempo;
            vocoder.process(inputBuffer.getChannelData(i));
            this._out.fill(0);
            if (this._passedBytes >= this._delayBytes) {
                if (vocoder.pop(this._out, frameSize) > 0) {
                    outputBuffer.copyToChannel(this._out, i);
                }
            }
            if (i === channels - 1) { this._passedBytes += frameSize }
        }
    }

    set pitch(v: number) {
        if (this._pitch === v) return;
        this._pitch = v;
    }

    get pitch() {
        return this._pitch;
    }

    set tempo(v: number) {
        if (this._tempo === v) return;
        this._tempo = v;
        this._updateDelayBytes();
    }

    get tempo() {
        return this._tempo;
    }

    get node() {
        return this._node;
    }

    get delay() {
        return this._delay;
    }
}