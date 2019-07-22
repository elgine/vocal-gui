import { clamp } from 'lodash';
import Effect, { EffectOptions, effectDescriptor, effectDefaultOptions } from './effect';
import AutoWah, { AutoWahOptions, autoWahDefaultOptions, autoWahDescriptor } from '../composite/autoWah';
import { EffectType } from '../effectType';

export interface UnderWaterOptions extends AutoWahOptions, EffectOptions{
    lowpassFreq: number;
    inputGain: number;
    underWaterBgGain: number;
}

export default class UnderWater extends Effect {

    static LOWPASS_FREQ_DEFAULT = 500;
    static LOWPASS_FREQ_MIN = 50;
    static LOWPASS_FREQ_MAX = 2500;

    static INPUT_GAIN_DEFAULT = 0.5;
    static INPUT_GAIN_MIN = 0.0;
    static INPUT_GAIN_MAX = 4.0;

    static UNDER_WATER_BG_GAIN_DEFAULT = 0.3;
    static UNDER_WATER_BG_GAIN_MIN = 0.0;
    static UNDER_WATER_BG_GAIN_MAX = 4.0;

    readonly type: EffectType = EffectType.UNDER_WATER;

    private _inputGain: GainNode;
    private _lowpass: BiquadFilterNode;
    private _compressor: DynamicsCompressorNode;
    private _underWater: AudioBufferSourceNode;
    private _underWaterGain: GainNode;
    private _wahwah: AutoWah;

    constructor(audioContext: BaseAudioContext, buffer: AudioBuffer) {
        super(audioContext);
        this._inputGain = this._audioContext.createGain();
        this._lowpass = this._audioContext.createBiquadFilter();
        this._compressor = this._audioContext.createDynamicsCompressor();
        this._underWater = this._audioContext.createBufferSource();
        this._underWater.buffer = buffer;
        this._underWaterGain = this._audioContext.createGain();
        this._wahwah = new AutoWah(this._audioContext);

        this._inputGain.connect(this._wahwah.input);
        this._wahwah.output.connect(this._lowpass);
        this._lowpass.connect(this._compressor);
        this._compressor.connect(this._gain);
        this._underWater.connect(this._underWaterGain);
        this._underWater.connect(this._compressor);

        this.set({
            lowpassFreq: UnderWater.LOWPASS_FREQ_DEFAULT,
            inputGain: UnderWater.INPUT_GAIN_DEFAULT,
            underWaterBgGain: UnderWater.UNDER_WATER_BG_GAIN_DEFAULT
        });
    }

    set(options: AnyOf<UnderWaterOptions>) {
        super.set(options);
        this._wahwah.set(options);
        if (options.lowpassFreq !== undefined) {
            this._lowpass.frequency.value = clamp(options.lowpassFreq, UnderWater.LOWPASS_FREQ_MIN, UnderWater.LOWPASS_FREQ_MAX);
        }
        if (options.inputGain !== undefined) {
            this._inputGain.gain.value = clamp(options.inputGain, UnderWater.INPUT_GAIN_MIN, UnderWater.INPUT_GAIN_MAX);
        }
        if (options.underWaterBgGain !== undefined) {
            this._underWaterGain.gain.value = clamp(options.underWaterBgGain, UnderWater.UNDER_WATER_BG_GAIN_MIN, UnderWater.UNDER_WATER_BG_GAIN_MAX);
        }
    }

    start() {
        this._wahwah.start();
        this._underWater.start();
    }

    stop() {
        this._wahwah.stop();
        this._underWater.stop();
    }

    dispose() {
        super.dispose();
    }
}

export const underWaterDescriptor = {
    lowpassFreq: {
        min: UnderWater.LOWPASS_FREQ_MIN,
        max: UnderWater.LOWPASS_FREQ_MAX,
        key: 'lowpassFreq',
        title: 'LOWPASS_FREQ'
    },
    inputGain: {
        min: UnderWater.INPUT_GAIN_MIN,
        max: UnderWater.INPUT_GAIN_MAX,
        key: 'inputGain',
        title: 'INPUT_GAIN'
    },
    underWaterBgGain: {
        min: UnderWater.UNDER_WATER_BG_GAIN_MIN,
        max: UnderWater.UNDER_WATER_BG_GAIN_MAX,
        key: 'underWaterBgGain',
        title: 'UNDER_WATER_BG_GAIN'
    },
    ...autoWahDescriptor,
    ...effectDescriptor
};

export const underWaterDefaultOptions = {
    lowpassFreq: UnderWater.LOWPASS_FREQ_DEFAULT,
    inputGain: UnderWater.INPUT_GAIN_DEFAULT,
    underWaterBgGain: UnderWater.UNDER_WATER_BG_GAIN_DEFAULT,
    ...autoWahDefaultOptions,
    ...effectDefaultOptions
};