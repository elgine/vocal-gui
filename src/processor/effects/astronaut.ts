import Effect from './effect';
import { buildCurve } from '../dsp/createBuffer';

export default class Astronaut extends Effect {

    private _b1: BiquadFilterNode;
    private _b2: BiquadFilterNode;
    private _b3: BiquadFilterNode;
    private _b4: BiquadFilterNode;
    private _b5: BiquadFilterNode;

    private _compressor: DynamicsCompressorNode;
    private _distortion: WaveShaperNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._distortion = this._audioContext.createWaveShaper();
        this._distortion.curve = buildCurve();

        this._b1 = this._audioContext.createBiquadFilter();
        this._b2 = this._audioContext.createBiquadFilter();
        this._b3 = this._audioContext.createBiquadFilter();
        this._b4 = this._audioContext.createBiquadFilter();
        this._b5 = this._audioContext.createBiquadFilter();
        this._compressor = this._audioContext.createDynamicsCompressor();

        this._b1.connect(this._distortion);
        this._distortion.connect(this._b2);
        this._b2.connect(this._b3);
        this._b3.connect(this._b4);
        this._b4.connect(this._b5);
        this._b5.connect(this._compressor);
        this._compressor.connect(this._gain);
    }

    dispose() {
        super.dispose();
        this._b1.disconnect();
        this._b2.disconnect();
        this._b3.disconnect();
        this._b4.disconnect();
        this._b5.disconnect();
        this._distortion.disconnect();
        this._compressor.disconnect();
    }

    get input() {
        return this._b1;
    }
}