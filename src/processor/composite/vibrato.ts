import Composite from './composite';
import { clamp } from 'lodash';

export interface VibratoOptions{
    vibratoDelay: number;
    vibratoDepth: number;
    vibratoSpeed: number;
}

export default class Vibrato extends Composite {

    static VIBRATO_DELAY_DEFAULT = 3.5;
    static VIBRATO_DELAY_MIN = 0.5;
    static VIBRATO_DELAY_MAX = 15.0;
    static VIBRATO_DEPTH_DEFAULT = 0.03;
    static VIBRATO_DEPTH_MIN = 0.005;
    static VIBRATO_DEPTH_MAX = 0.055;
    static VIBRATO_SPEED_DEFAULT = 0.002;
    static VIBRATO_SPEED_MIN = 0.0005;
    static VIBRATO_SPEED_MAX = 0.004;

    private _osc: OscillatorNode;
    private _delay: DelayNode;
    private _oscGain: GainNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._osc = this._audioContext.createOscillator();
        this._delay = this._audioContext.createDelay(Vibrato.VIBRATO_DELAY_MAX);
        this._oscGain = this._audioContext.createGain();

        this._osc.connect(this._oscGain);
        this._oscGain.connect(this._delay.delayTime);
        this._input.connect(this._delay);
        this._delay.connect(this._wet);
        this._osc.start();
        this.set({
            vibratoDelay: Vibrato.VIBRATO_DELAY_DEFAULT,
            vibratoDepth: Vibrato.VIBRATO_DEPTH_DEFAULT,
            vibratoSpeed: Vibrato.VIBRATO_SPEED_DEFAULT
        });
    }

    set(options: AnyOf<VibratoOptions>) {
        if (options.vibratoDelay !== undefined) {
            this._delay.delayTime.value = clamp(options.vibratoDelay, Vibrato.VIBRATO_DELAY_MIN, Vibrato.VIBRATO_DELAY_MAX);
        }
        if (options.vibratoDepth !== undefined) {
            this._oscGain.gain.value = clamp(options.vibratoDepth, Vibrato.VIBRATO_DEPTH_MIN, Vibrato.VIBRATO_DEPTH_MAX);
        }
        if (options.vibratoSpeed !== undefined) {
            this._osc.frequency.value = clamp(options.vibratoSpeed, Vibrato.VIBRATO_SPEED_MIN, Vibrato.VIBRATO_SPEED_MAX);
        }
    }

    dispose() {
        super.dispose();
        this._osc.disconnect();
        this._oscGain.disconnect();
        this._delay.disconnect();
    }

    get delay() {
        return this._delay.delayTime.value;
    }
}

export const vibratoDescriptor = {
    vibratoDelay: {
        min: Vibrato.VIBRATO_DELAY_MIN,
        max: Vibrato.VIBRATO_DELAY_MAX,
        key: 'vibratoDelay',
        title: 'VIBRATO_DELAY'
    },
    vibratoDepth: {
        min: Vibrato.VIBRATO_DEPTH_MIN,
        max: Vibrato.VIBRATO_DEPTH_MAX,
        key: 'vibratoDepth',
        title: 'VIBRATO_DEPTH'
    },
    vibratoSpeed: {
        min: Vibrato.VIBRATO_SPEED_MIN,
        max: Vibrato.VIBRATO_SPEED_MAX,
        key: 'vibratoSpeed',
        title: 'VIBRATO_SPEED'
    }
};

export const vibrartoDefaultOptions = {
    vibratoDelay: Vibrato.VIBRATO_DELAY_DEFAULT,
    vibratoDepth: Vibrato.VIBRATO_DEPTH_DEFAULT,
    vibratoSpeed: Vibrato.VIBRATO_SPEED_DEFAULT
};