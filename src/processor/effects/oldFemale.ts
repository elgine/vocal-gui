import { clamp } from 'lodash';
import Effect, { EffectOptions, effectDescriptor, effectDefaultOptions } from './effect';
import { PhaseVocoderOptions, phaseVocoderDefaultOptions, phaseVocoderDescriptor } from '../dsp/phaseVocoder';
import Vibrato, { VibratoOptions, vibrartoDefaultOptions, vibratoDescriptor } from '../composite/vibrato';
import PhaseVocoderNode from '../phaseVocoderNode';
import { EffectType } from '../effectType';

export interface OldFemaleOptions extends PhaseVocoderOptions, VibratoOptions, EffectOptions{
    highpassFreq: number;
}

export default class OldFemale extends Effect {

    static HIGHPASS_FREQ_DEFAULT = 120.0;
    static HIGHPASS_FREQ_MIN = 100;
    static HIGHPASS_FREQ_MAX = 4000;

    readonly type: EffectType = EffectType.OLD_FEMALE;

    private _highpass: BiquadFilterNode;
    private _vocoder: PhaseVocoderNode;
    private _vibrato: Vibrato;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._highpass = this._audioContext.createBiquadFilter();
        this._vocoder = new PhaseVocoderNode(this._audioContext);
        this._vibrato = new Vibrato(this._audioContext);

        this._vocoder.node.connect(this._highpass);
        this._highpass.connect(this._vibrato.input);
        this._vibrato.output.connect(this._gain);

        this.set({
            highpassFreq: OldFemale.HIGHPASS_FREQ_DEFAULT
        });
    }

    set(options: AnyOf<OldFemaleOptions>) {
        super.set(options);
        if (options.highpassFreq !== undefined) {
            this._highpass.frequency.value = clamp(options.highpassFreq, OldFemale.HIGHPASS_FREQ_MIN, OldFemale.HIGHPASS_FREQ_MAX);
        }
        this._vocoder.set(options);
        this._vibrato.set(options);
    }

    dispose() {
        super.dispose();
        this._highpass.disconnect();
        this._vocoder.node.disconnect();
        this._vibrato.dispose();
    }

    get input() {
        return this._vocoder.node;
    }
}

export const oldFemaleDescriptor = {
    highpassFreq: {
        min: OldFemale.HIGHPASS_FREQ_MIN,
        max: OldFemale.HIGHPASS_FREQ_MAX,
        key: 'highpassFreq',
        title: 'HIGHPASS_FREQ'
    },
    ...phaseVocoderDescriptor,
    ...vibratoDescriptor,
    ...effectDescriptor
};

export const oldFemaleDefaultOptions = {
    highpassFreq: OldFemale.HIGHPASS_FREQ_DEFAULT,
    ...phaseVocoderDefaultOptions,
    ...vibrartoDefaultOptions,
    ...effectDefaultOptions
};