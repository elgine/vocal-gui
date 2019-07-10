import { clamp } from 'lodash';
import Effect, { EffectOptions } from './effect';
import Jungle, { JungleOptions } from '../composite/jungle';

export interface UncleOptions extends JungleOptions, EffectOptions{
    lowpassFreq: number;
}

export default class Uncle extends Effect {

    static LOWPASS_FREQ_DEFAULT = 4500;
    static LOWPASS_FREQ_MIN = 500;
    static LOWPASS_FREQ_MAX = 20000;

    private _lowpass: BiquadFilterNode;
    private _jungle: Jungle;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._lowpass = this._audioContext.createBiquadFilter();
        this._jungle = new Jungle(this._audioContext);

        this._lowpass.connect(this._jungle.input);
        this._jungle.output.connect(this._gain);

        this.set({
            lowpassFreq: Uncle.LOWPASS_FREQ_DEFAULT
        });
    }

    set(options: AnyOf<UncleOptions>) {
        super.set(options);
        if (options.lowpassFreq !== undefined) {
            this._lowpass.frequency.value = clamp(options.lowpassFreq, Uncle.LOWPASS_FREQ_MIN, Uncle.LOWPASS_FREQ_MAX);
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