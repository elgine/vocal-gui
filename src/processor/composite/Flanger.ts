import { clamp } from 'lodash';
import Composite from './composite';

export interface FlangerOptions{
    flangerSpeed: number;
    flangerDelay: number;
    flangerDepth: number;
    flangerFeedback: number;
}

export default class Flanger extends Composite {

    static FLANGER_SPEED_DEFAULT = 0.25;
    static FLANGER_SPEED_MIN = 0.05;
    static FLANGER_SPEED_MAX = 5.0;
    static FLANGER_DELAY_DEFAULT = 0.005;
    static FLANGER_DELAY_MIN = 0.001;
    static FLANGER_DELAY_MAX = 0.02;
    static FLANGER_DEPTH_DEFAULT = 0.002;
    static FLANGER_DEPTH_MIN = 0.0005;
    static FLANGER_DEPTH_MAX = 0.005;
    static FLANGER_FEEDBACK_DEFAULT = 0.5;
    static FLANGER_FEEDBACK_MIN = 0.0;
    static FLANGER_FEEDBACK_MAX = 1.0;

    private _osc: OscillatorNode;
    private _oscGain: GainNode;
    private _delay: DelayNode;
    private _feedback: GainNode;

    constructor(audioContext: AudioContext) {
        super(audioContext);
        this._osc = this._audioContext.createOscillator();
        this._oscGain = this._audioContext.createGain();
        this._delay = this._audioContext.createDelay();
        this._feedback = this._audioContext.createGain();

        this._osc.connect(this._oscGain);
        this._oscGain.connect(this._delay.delayTime);
        this._input.connect(this._wet);
        this._input.connect(this._delay);
        this._delay.connect(this._wet);
        this._delay.connect(this._feedback);
        this._feedback.connect(this._input);

        this.set({
            flangerSpeed: Flanger.FLANGER_SPEED_DEFAULT,
            flangerDelay: Flanger.FLANGER_DELAY_DEFAULT,
            flangerDepth: Flanger.FLANGER_DEPTH_DEFAULT,
            flangerFeedback: Flanger.FLANGER_FEEDBACK_DEFAULT
        });
    }

    start() {
        this._osc.start();
    }

    stop() {
        this._osc.stop();
    }

    set(options: AnyOf<FlangerOptions>) {
        if (options.flangerSpeed !== undefined) { this._osc.frequency.value = clamp(options.flangerSpeed, Flanger.FLANGER_SPEED_MIN, Flanger.FLANGER_SPEED_MAX) }
        if (options.flangerDelay !== undefined) { this._delay.delayTime.value = clamp(options.flangerDelay, Flanger.FLANGER_DELAY_MIN, Flanger.FLANGER_DELAY_MAX) }
        if (options.flangerDepth !== undefined) { this._oscGain.gain.value = clamp(options.flangerDepth, Flanger.FLANGER_DEPTH_MIN, Flanger.FLANGER_DEPTH_MAX) }
        if (options.flangerFeedback !== undefined) { this._feedback.gain.value = clamp(options.flangerFeedback, Flanger.FLANGER_FEEDBACK_MIN, Flanger.FLANGER_FEEDBACK_MAX) }
    }

    dispose() {
        super.dispose();
        this._osc.disconnect();
        this._oscGain.disconnect();
        this._delay.disconnect();
        this._feedback.disconnect();
    }
}