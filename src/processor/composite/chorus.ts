import Composite from './composite';
import { clamp } from 'lodash';

export interface ChorusOptions{
    chorusSpeed: number;
    chorusDelay: number;
    chorusDepth: number;
}

export default class Chorus extends Composite {
    static CHORUS_SPEED_DEFAULT = 3.5;
    static CHORUS_SPEED_MIN = 0.5;
    static CHORUS_SPEED_MAX = 15.0;
    static CHORUS_DELAY_DEFAULT = 0.03;
    static CHORUS_DELAY_MIN = 0.005;
    static CHORUS_DELAY_MAX = 0.055;
    static CHORUS_DEPTH_DEFAULT = 0.002;
    static CHORUS_DEPTH_MIN = 0.0005;
    static CHORUS_DEPTH_MAX = 0.004;

    private _delay: DelayNode;
    private _oscGain: GainNode;
    private _osc: OscillatorNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._delay = this._audioContext.createDelay();
        this._osc = this._audioContext.createOscillator();
        this._oscGain = this._audioContext.createGain();

        this._osc.connect(this._oscGain);
        this._oscGain.connect(this._delay.delayTime);
        this._input.connect(this._wet);
        this._input.connect(this._delay);
        this._delay.connect(this._wet);
        this._osc.start();
        this.set({
            chorusDelay: Chorus.CHORUS_DELAY_DEFAULT,
            chorusDepth: Chorus.CHORUS_DEPTH_DEFAULT,
            chorusSpeed: Chorus.CHORUS_SPEED_DEFAULT
        });
    }

    set(options: AnyOf<ChorusOptions>) {
        if (options.chorusDelay !== undefined) {
            this._delay.delayTime.value = clamp(options.chorusDelay, Chorus.CHORUS_DELAY_MIN, Chorus.CHORUS_DELAY_MAX);
        }
        if (options.chorusDepth !== undefined) {
            this._oscGain.gain.value = clamp(options.chorusDepth, Chorus.CHORUS_DEPTH_MIN, Chorus.CHORUS_DEPTH_MAX);
        }
        if (options.chorusSpeed !== undefined) {
            this._osc.frequency.value = clamp(options.chorusSpeed, Chorus.CHORUS_SPEED_MIN, Chorus.CHORUS_SPEED_MAX);
        }
    }

    dispose() {
        super.dispose();
        this._delay.disconnect();
        this._osc.disconnect();
        this._oscGain.disconnect();
    }
}