import { clamp } from 'lodash';
import Effect, { EffectOptions, effectDescriptor, effectDefaultOptions } from './effect';
import Jungle, { JungleOptions, jungleDefaultOptions, jungleDescriptor } from '../composite/jungle';
import { EffectType } from '../effectType';

export interface MaleOptions extends JungleOptions, EffectOptions{
    lowpassFreq: number;
}

export default class Male extends Effect {

    static LOWPASS_FREQ_DEFAULT = 4000.0;
    static LOWPASS_FREQ_MIN = 2000;
    static LOWPASS_FREQ_MAX = 20000;

    readonly type: EffectType = EffectType.MALE;

    private _lowpass: BiquadFilterNode;
    private _jungle: Jungle;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._lowpass = this._audioContext.createBiquadFilter();
        this._jungle = new Jungle(this._audioContext);
        this._lowpass.connect(this._jungle.input);
        this._jungle.output.connect(this._gain);
        this.set(maleDefaultOptions);
    }

    set(options: AnyOf<MaleOptions>) {
        super.set(options);
        if (options.lowpassFreq !== undefined) {
            this._lowpass.frequency.value = clamp(options.lowpassFreq, Male.LOWPASS_FREQ_MIN, Male.LOWPASS_FREQ_MAX);
        }
        this._jungle.set(options);
    }

    dispose() {
        super.dispose();
        this._lowpass.disconnect();
        this._jungle.dispose();
    }

    get input() {
        return this._lowpass;
    }
}

export const maleDescriptor = {
    lowpassFreq: {
        min: Male.LOWPASS_FREQ_MIN,
        max: Male.LOWPASS_FREQ_MAX,
        key: 'lowpassFreq',
        title: 'LOWPASS_FREQ'
    },
    ...jungleDescriptor,
    ...effectDescriptor
};

export const maleDefaultOptions = {
    lowpassFreq: Male.LOWPASS_FREQ_DEFAULT,
    pitchOffset: -0.35,
    ...effectDefaultOptions
};