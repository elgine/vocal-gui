import { clamp } from 'lodash';
import Effect, { EffectOptions } from './effect';
import { PhaseVocoderOptions, phaseVocoderDefaultOptions } from '../dsp/phaseVocoder';
import Vibrato, { VibratoOptions, vibrartoDefaultOptions } from '../composite/vibrato';
import PhaseVocoderNode from '../phaseVocoderNode';

export interface OldMaleOptions extends PhaseVocoderOptions, VibratoOptions, EffectOptions{
    lowpassFreq: number;
}

export default class OldMale extends Effect {

    static LOWPASS_FREQ_DEFAULT = 8000.0;
    static LOWPASS_FREQ_MIN = 500;
    static LOWPASS_FREQ_MAX = 20000;

    private _lowpass: BiquadFilterNode;
    private _vocoder: PhaseVocoderNode;
    private _vibrato: Vibrato;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._lowpass = this._audioContext.createBiquadFilter();
        this._vocoder = new PhaseVocoderNode(this._audioContext);
        this._vibrato = new Vibrato(this._audioContext);

        this._lowpass.connect(this._vocoder.node);
        this._vocoder.node.connect(this._vibrato.input);
        this._vibrato.output.connect(this._gain);

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

    start() {
        this._vibrato.start();
    }

    stop() {
        this._vibrato.stop();
    }

    dispose() {
        super.dispose();
        this._lowpass.disconnect();
        this._vocoder.node.disconnect();
        this._vibrato.dispose();
    }

    get input() {
        return this._lowpass;
    }
}

export const oldMaleDefaultOptions = {
    lowpassFreq: OldMale.LOWPASS_FREQ_DEFAULT,
    ...phaseVocoderDefaultOptions,
    ...vibrartoDefaultOptions
};