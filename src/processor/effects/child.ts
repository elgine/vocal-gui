import { clamp } from 'lodash';
import Effect, { EffectOptions } from './effect';
import Equalizer3Band, { Equalizer3BandOptions, equalizer3BandDescriptor, equalizer3BandDefaultOptions } from '../composite/equalizer3Band';
import PhaseVocoderNode from '../phaseVocoderNode';

export interface ChildOptions extends Equalizer3BandOptions, EffectOptions{
    highpassFreq: number;
    pitch: number;
}

export default class Child extends Effect {

    static HIGHPASS_FREQ_DEFAULT = 500.0;
    static HIGHPASS_FREQ_MIN = 120;
    static HIGHPASS_FREQ_MAX = 500;

    static LOWSHELF_GAIN_DEFAULT = Equalizer3Band.LOWSHELF_GAIN_DEFAULT;
    static LOWSHELF_GAIN_MIN = Equalizer3Band.LOWSHELF_GAIN_MIN;
    static LOWSHELF_GAIN_MAX = Equalizer3Band.LOWSHELF_GAIN_MAX;

    static PEAKING_GAIN_DEFAULT = Equalizer3Band.PEAKING_GAIN_DEFAULT;
    static PEAKING_GAIN_MIN = Equalizer3Band.PEAKING_GAIN_MIN;
    static PEAKING_GAIN_MAX = Equalizer3Band.PEAKING_GAIN_MAX;

    static HIGHSHELF_GAIN_DEFAULT = Equalizer3Band.HIGHSHELF_GAIN_DEFAULT;
    static HIGHSHELF_GAIN_MIN = Equalizer3Band.HIGHSHELF_GAIN_MIN;
    static HIGHSHELF_GAIN_MAX = Equalizer3Band.HIGHSHELF_GAIN_MAX;

    static PITCH_DEFAULT = 1.5;
    static PITCH_MIN = 0.5;
    static PITCH_MAX = 2.0;

    private _phaseVocoder: PhaseVocoderNode;
    private _equalizer: Equalizer3Band;
    private _highpass: BiquadFilterNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._phaseVocoder = new PhaseVocoderNode(this._audioContext);
        this._equalizer = new Equalizer3Band(this._audioContext);
        this._highpass = this._audioContext.createBiquadFilter();
        this._highpass.type = 'highpass';

        this._equalizer.output.connect(this._phaseVocoder.node);
        this._phaseVocoder.node.connect(this._highpass);
        this._highpass.connect(this._gain);

        this.set(childDefaultOptions);
    }

    set(options: AnyOf<ChildOptions>) {
        super.set(options);
        if (options.highpassFreq !== undefined) {
            this._highpass.frequency.value = clamp(options.highpassFreq, Child.HIGHPASS_FREQ_MIN, Child.HIGHPASS_FREQ_MAX);
        }
        this._equalizer.set(options);
        if (options.pitch !== undefined) {
            this._phaseVocoder.pitch = clamp(options.pitch, Child.PITCH_MIN, Child.PITCH_MAX);
        }
    }

    dispose() {
        super.dispose();
        this._phaseVocoder.node.disconnect();
        this._equalizer.dispose();
        this._highpass.disconnect();
    }

    get input() {
        return this._equalizer.input;
    }
}

export const childDescriptor = {
    highpassFreq: {
        min: Child.HIGHPASS_FREQ_MIN,
        max: Child.HIGHPASS_FREQ_MAX,
        key: 'highpassFreq',
        title: 'HIGHPASS_FREQ'
    },
    pitch: {
        min: Child.PITCH_MIN,
        max: Child.PITCH_MAX,
        key: 'pitch',
        title: 'PITCH'
    },
    ...equalizer3BandDescriptor
};

export const childDefaultOptions = {
    highpassFreq: Child.HIGHPASS_FREQ_DEFAULT,
    pitch: Child.PITCH_DEFAULT,
    ...equalizer3BandDefaultOptions
};