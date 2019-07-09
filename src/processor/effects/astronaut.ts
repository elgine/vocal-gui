import Effect from './effect';

const buildCurve = (sampleRate: number = 44100, gain: number = 0.5) => {
    gain = gain * 100;
    let curveLength = sampleRate;
    let curve = new Float32Array(curveLength);
    let deg = Math.PI / 180;
    for (let i = 0; i < sampleRate; ++i) {
        let x = i * 2.0 / sampleRate - 1.0;
        curve[i] = (3 + gain) * x * 20 * deg / (Math.PI + gain * Math.abs(x));
    }
    return curve;
};

export default class Astronaut extends Effect {

    private _b1: BiquadFilterNode;
    private _b2: BiquadFilterNode;
    private _b3: BiquadFilterNode;
    private _b4: BiquadFilterNode;
    private _b5: BiquadFilterNode;

    private _compressor: DynamicsCompressorNode;
    private _distortion: WaveShaperNode;

    constructor(audioContext: AudioContext) {
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
}