export default class Composite {

    protected _audioContext: BaseAudioContext;
    protected _input: GainNode;
    protected _dry: GainNode;
    protected _wet: GainNode;
    protected _output: GainNode;

    constructor(audioContext: BaseAudioContext) {
        this._audioContext = audioContext;
        this._input = this._audioContext.createGain();
        this._output = this._audioContext.createGain();
        this._dry = this._audioContext.createGain();
        this._wet = this._audioContext.createGain();

        this._dry.connect(this._output);
        this._wet.connect(this._output);
    }

    set(options: any) {}

    clear() {}

    crossFade(v: number) {
        let gain1 = Math.cos(v * 0.5 * Math.PI);
        let gain2 = Math.cos((1 - v) * 0.5 * Math.PI);
        this._dry.gain.value = gain1;
        this._wet.gain.value = gain2;
    }

    dispose() {
        this._input.disconnect();
        this._dry.disconnect();
        this._wet.disconnect();
        this._output.disconnect();
    }

    get output() {
        return this._output;
    }

    get input() {
        return this._input;
    }
}