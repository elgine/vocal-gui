import Effect from './effect';
import { EffectType } from '../effectType';

export default class Robot1 extends Effect {

    readonly type: EffectType = EffectType.ROBOT1;

    private _osc: OscillatorNode;
    private _oscGain: GainNode;
    private _delay: DelayNode;
    private _biquad: BiquadFilterNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._osc = this._audioContext.createOscillator();
        this._oscGain = this._audioContext.createGain();
        this._delay = this._audioContext.createDelay();
        this._biquad = this._audioContext.createBiquadFilter();

        this._delay.delayTime.value = 0.01;
        this._osc.frequency.value = 700;
        this._oscGain.gain.value = 0.004;
        this._biquad.type = 'highpass';
        this._biquad.frequency.value = 695;
        this._osc.connect(this._oscGain);
        this._oscGain.connect(this._delay.delayTime);
        this._delay.connect(this._biquad);
        this._biquad.connect(this._gain);
        this._osc.start();
    }

    dispose() {
        super.dispose();
        this._osc.disconnect();
        this._oscGain.disconnect();
        this._delay.disconnect();
        this._biquad.disconnect();
    }

    get input() {
        return this._delay;
    }
}