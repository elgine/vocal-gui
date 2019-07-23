import Effect, { EffectOptions, effectDefaultOptions, effectDescriptor } from './effect';
import { EffectType } from '../effectType';

export interface AlienOptions extends EffectOptions{
    lfoFreq: number;
    lfoGain: number;
}

export default class Alien extends Effect {

    static LFO_FREQ_DEFAULT = 5.0;
    static LFO_FREQ_MIN = -22050;
    static LFO_FREQ_MAX = 22050;

    static LFO_GAIN_DEFAULT = 0.05;
    static LFO_GAIN_MIN = 0.0;
    static LFO_GAIN_MAX = 4.0;

    readonly type: EffectType = EffectType.ALIEN;

    private _delay: DelayNode;
    private _osc!: OscillatorNode;
    private _oscGain: GainNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._delay = this._audioContext.createDelay();
        this._osc = this._audioContext.createOscillator();
        this._oscGain = this._audioContext.createGain();
        this._oscGain.connect(this._delay.delayTime);
        this._delay.connect(this._gain);
        this._delay.delayTime.value = 0.05;
        this._osc.connect(this._oscGain);
        this._osc.start();
        this.set(alienDefaultOptions);
    }

    set(options: AnyOf<AlienOptions>) {
        super.set(options);
        if (options.lfoFreq !== undefined) {
            this._osc.frequency.value = options.lfoFreq;
        }
        if (options.lfoGain !== undefined) {
            this._oscGain.gain.value = options.lfoGain;
        }
    }

    dispose() {
        super.dispose();
        this._osc.disconnect();
        this._oscGain.disconnect();
        this._delay.disconnect();
    }

    get input() {
        return this._delay;
    }
}

export const alienDescriptor = {
    lfoFreq: {
        key: 'lfoFreq',
        title: 'LFO_FREQ',
        min: Alien.LFO_FREQ_MIN,
        max: Alien.LFO_FREQ_MAX
    },
    lfoGain: {
        key: 'lfoGain',
        title: 'LFO_GAIN',
        min: Alien.LFO_GAIN_MIN,
        max: Alien.LFO_GAIN_MAX
    },
    ...effectDescriptor
};

export const alienDefaultOptions = {
    lfoFreq: Alien.LFO_FREQ_DEFAULT,
    lfoGain: Alien.LFO_GAIN_DEFAULT,
    ...effectDefaultOptions
};