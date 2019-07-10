import Effect from './effect';

export default class Telephone extends Effect {

    private _b1: BiquadFilterNode;
    private _b2: BiquadFilterNode;
    private _b3: BiquadFilterNode;
    private _b4: BiquadFilterNode;
    private _compressor: DynamicsCompressorNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._b1 = this._audioContext.createBiquadFilter();
        this._b2 = this._audioContext.createBiquadFilter();
        this._b3 = this._audioContext.createBiquadFilter();
        this._b4 = this._audioContext.createBiquadFilter();
        this._compressor = this._audioContext.createDynamicsCompressor();

        this._b1.frequency.value = 2000;
        this._b2.frequency.value = 2000;
        this._b3.type = 'highpass';
        this._b3.frequency.value = 500;
        this._b4.type = 'highpass';
        this._b4.frequency.value = 500;

        this._b1.connect(this._b2);
        this._b2.connect(this._b3);
        this._b3.connect(this._b4);
        this._b4.connect(this._compressor);
        this._compressor.connect(this._gain);
    }

    dispose() {
        super.dispose();
        this._b1.disconnect();
        this._b2.disconnect();
        this._b3.disconnect();
        this._b4.disconnect();
        this._compressor.disconnect();
    }

    get input() {
        return this._b1;
    }
}