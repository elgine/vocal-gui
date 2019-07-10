import Effect from './effect';
import { buildCurve } from '../dsp/createBuffer';

export default class Megaphone extends Effect {

    private _compressor: DynamicsCompressorNode;
    private _distortion: WaveShaperNode;
    private _lpf1: BiquadFilterNode;
    private _lpf2: BiquadFilterNode;
    private _hpf1: BiquadFilterNode;
    private _hpf2: BiquadFilterNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._compressor = this._audioContext.createDynamicsCompressor();
        this._distortion = this._audioContext.createWaveShaper();
        this._distortion.curve = buildCurve();

        this._lpf1 = this._audioContext.createBiquadFilter();
        this._lpf2 = this._audioContext.createBiquadFilter();
        this._hpf1 = this._audioContext.createBiquadFilter();
        this._hpf2 = this._audioContext.createBiquadFilter();

        this._lpf1.frequency.value = 2000;
        this._lpf2.frequency.value = 2000;
        this._hpf1.type = 'highpass';
        this._hpf1.frequency.value = 500;
        this._hpf2.type = 'highpass';
        this._hpf2.frequency.value = 500;

        this._lpf1.connect(this._lpf2);
        this._lpf2.connect(this._hpf1);
        this._hpf1.connect(this._hpf2);
        this._hpf2.connect(this._distortion);
        this._distortion.connect(this._compressor);
        this._compressor.connect(this._gain);
    }

    dispose() {
        super.dispose();
        this._compressor.disconnect();
        this._distortion.disconnect();
        this._lpf1.disconnect();
        this._lpf2.disconnect();
        this._hpf1.disconnect();
        this._hpf2.disconnect();
    }

    get input() {
        return this._lpf1;
    }
}