import PhaseVocoder, { PhaseVocoderOptions } from './dsp/phaseVocoder';

export default class PhaseVocoderNode {

    public overlap: number = 0.25;
    public pitch: number = 1;
    public tempo: number = 1;

    private _vocoders: PhaseVocoder[] = [];
    private _node: ScriptProcessorNode;

    private _out: Float32Array;

    constructor(audioContext: BaseAudioContext, bufferSize: number = 1024, inChannels?: number, outChannels?: number) {
        this._node = audioContext.createScriptProcessor(bufferSize, inChannels, outChannels);
        this._node.onaudioprocess = this._onProcess.bind(this);
        this._out = new Float32Array(this._node.bufferSize);
    }

    set(options: AnyOf<PhaseVocoderOptions>) {
        if (options.pitch !== undefined) { this.pitch = options.pitch }
        if (options.tempo !== undefined) { this.tempo = options.tempo }
    }

    private _onProcess(e: AudioProcessingEvent) {
        const { inputBuffer, outputBuffer } = e;
        const frameSize = inputBuffer.length;
        const inChannels = inputBuffer.numberOfChannels;
        const outChannels = outputBuffer.numberOfChannels;
        const vocoderCount = this._vocoders.length;
        for (let i = 0; i < Math.min(inChannels, outChannels); i++) {
            let vocoder: PhaseVocoder;
            if (i >= vocoderCount) {
                vocoder = new PhaseVocoder(frameSize, this.overlap);
                this._vocoders.push(vocoder);
            } else {
                vocoder = this._vocoders[i];
            }
            vocoder.pitch = this.pitch;
            vocoder.tempo = this.tempo;
            vocoder.process(inputBuffer.getChannelData(i));
            if (vocoder.pop(this._out, frameSize) > 0) {
                outputBuffer.copyToChannel(this._out, i);
            }
        }
    }

    get node() {
        return this._node;
    }
}