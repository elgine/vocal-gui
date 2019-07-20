import { clamp } from 'lodash';
import Effect, { EffectOptions } from './effect';
import Jungle, { JungleOptions, jungleDefaultOptions } from '../composite/jungle';

export interface MaleOptions extends JungleOptions, EffectOptions{
    lowpassFreq: number;
}

export default class Male extends Effect {

    static LOWPASS_FREQ_DEFAULT = 4000.0;
    static LOWPASS_FREQ_MIN = 2000;
    static LOWPASS_FREQ_MAX = 20000;

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

    start() {
        this._jungle.start();
    }

    stop() {
        this._jungle.stop();
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
    }
};

export const maleDefaultOptions = {
    lowpassFreq: Male.LOWPASS_FREQ_DEFAULT,
    ...jungleDefaultOptions
};