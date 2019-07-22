import Effect from './effect';
import { EffectType } from '../effectType';

export default class Robot2 extends Effect {

    readonly type: EffectType = EffectType.ROBOT2;

    private _osc1: OscillatorNode;
    private _osc2: OscillatorNode;
    private _osc3: OscillatorNode;
    private _oscGain: GainNode;
    private _delay: DelayNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._osc1 = this._audioContext.createOscillator();
        this._osc2 = this._audioContext.createOscillator();
        this._osc3 = this._audioContext.createOscillator();
        this._oscGain = this._audioContext.createGain();
        this._delay = this._audioContext.createDelay();

        this._osc1.type = 'sawtooth';
        this._osc1.frequency.value = 50;
        this._osc2.type = 'sawtooth';
        this._osc2.frequency.value = 1000;
        this._osc3.frequency.value = 50;
        this._delay.delayTime.value = 0.01;
        this._oscGain.gain.value = 0.004;

        this._osc1.connect(this._oscGain);
        this._osc2.connect(this._oscGain);
        this._osc3.connect(this._oscGain);
        this._oscGain.connect(this._delay.delayTime);
        this._delay.connect(this._gain);
    }

    start() {
        this._osc1.start();
        this._osc2.start();
        this._osc3.start();
    }

    stop() {
        this._osc1.stop();
        this._osc2.stop();
        this._osc3.stop();
    }

    dispose() {
        super.dispose();
        this._osc1.disconnect();
        this._osc2.disconnect();
        this._osc3.disconnect();
        this._oscGain.disconnect();
        this._delay.disconnect();
    }

    get input() {
        return this._delay;
    }
}