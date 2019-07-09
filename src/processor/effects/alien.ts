import Effect, { EffectOptions } from './effect';

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

    private _delay: DelayNode;
    private _osc: OscillatorNode;
    private _oscGain: GainNode;

    constructor(audioContext: AudioContext) {
        super(audioContext);
        this._delay = this._audioContext.createDelay();
        this._osc = this._audioContext.createOscillator();
        this._oscGain = this._audioContext.createGain();
        this._osc.connect(this._oscGain);
        this._oscGain.connect(this._delay.delayTime);
        this._delay.connect(this._gain);
        this._delay.delayTime.value = 0.05;
        this.set({
            lfoFreq: Alien.LFO_FREQ_DEFAULT,
            lfoGain: Alien.LFO_GAIN_DEFAULT
        });
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

    start() {
        this._osc.start();
    }

    stop() {
        this._osc.stop();
    }

    dispose() {
        super.dispose();
    }
}