import { clamp } from 'lodash';
import Effect, { EffectOptions, effectDescriptor, effectDefaultOptions } from './effect';
import { PhaseVocoderOptions, phaseVocoderDefaultOptions, phaseVocoderDescriptor } from '../dsp/phaseVocoder';
import Vibrato, { VibratoOptions, vibrartoDefaultOptions, vibratoDescriptor } from '../composite/vibrato';
import PhaseVocoderNode from '../phaseVocoderNode';
import { EffectType } from '../effectType';

export interface OldMaleOptions extends PhaseVocoderOptions, VibratoOptions, EffectOptions{
    lowpassFreq: number;
}

export default class OldMale extends Effect {

    static LOWPASS_FREQ_DEFAULT = 8000.0;
    static LOWPASS_FREQ_MIN = 500;
    static LOWPASS_FREQ_MAX = 20000;

    readonly type: EffectType = EffectType.OLD_MALE;

    private _lowpass: BiquadFilterNode;
    private _vocoder: PhaseVocoderNode;
    private _vibrato: Vibrato;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._lowpass = this._audioContext.createBiquadFilter();
        this._vocoder = new PhaseVocoderNode(this._audioContext);
        this._vibrato = new Vibrato(this._audioContext);

        // this._lowpass.connect(this._vocoder.node);
        this._vocoder.node.connect(this._gain);
        // this._vocoder.node.connect(this._vibrato.input);
        // this._vibrato.output.connect(this._gain);

        this.set({
            lowpassFreq: OldMale.LOWPASS_FREQ_DEFAULT
        });
    }

    set(options: AnyOf<OldMaleOptions>) {
        super.set(options);
        if (options.lowpassFreq !== undefined) {
            this._lowpass.frequency.value = clamp(options.lowpassFreq, OldMale.LOWPASS_FREQ_MIN, OldMale.LOWPASS_FREQ_MAX);
        }
        this._vocoder.set(options);
        this._vibrato.set(options);
    }

    dispose() {
        super.dispose();
        this._lowpass.disconnect();
        this._vocoder.node.disconnect();
        this._vibrato.dispose();
    }

    get input() {
        // return this._lowpass;
        return this._vocoder.node;
    }
}

export const oldMaleDescriptor = {
    lowpassFreq: {
        min: OldMale.LOWPASS_FREQ_MIN,
        max: OldMale.LOWPASS_FREQ_MAX,
        key: 'lowpassFreq',
        title: 'LOWPASS_FREQ'
    },
    ...phaseVocoderDescriptor,
    ...vibratoDescriptor,
    ...effectDescriptor
};

export const oldMaleDefaultOptions = {
    lowpassFreq: OldMale.LOWPASS_FREQ_DEFAULT,
    ...phaseVocoderDefaultOptions,
    ...vibrartoDefaultOptions,
    ...effectDefaultOptions
};