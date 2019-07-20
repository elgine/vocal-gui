import { clamp } from 'lodash';
import Composite from './composite';
import { createDelayTimeBuffer, createFadeBuffer } from '../dsp/createBuffer';

export interface JungleOptions{
    pitchOffset: number;
}

export default class Jungle extends Composite {

    static PITCH_OFFSET_DEFAULT: number = 0;
    static PITCH_OFFSET_MIN: number = -0.1;
    static PITCH_OFFSET_MAX: number = 1;

    private _previousPitch: number = 1;
    private _bufferTime: number;
    private _fadeTime: number;

    private _mod1: AudioBufferSourceNode;
    private _mod2: AudioBufferSourceNode;
    private _mod3: AudioBufferSourceNode;
    private _mod4: AudioBufferSourceNode;
    private _mod1Gain: GainNode;
    private _mod2Gain: GainNode;
    private _mod3Gain: GainNode;
    private _mod4Gain: GainNode;

    private _modGain1: GainNode;
    private _modGain2: GainNode;

    private _fade1: AudioBufferSourceNode;
    private _fade2: AudioBufferSourceNode;
    private _delay1: DelayNode;
    private _delay2: DelayNode;
    private _mix1: GainNode;
    private _mix2: GainNode;

    constructor(audioContext: BaseAudioContext, delayTime: number = 0.1, fadeTime: number = 0.05, bufferTime: number = 0.1) {
        super(audioContext);
        this._previousPitch = -1;
        this._bufferTime = bufferTime;
        this._fadeTime = fadeTime;

        this._mod1 = this._audioContext.createBufferSource();
        this._mod2 = this._audioContext.createBufferSource();
        this._mod3 = this._audioContext.createBufferSource();
        this._mod4 = this._audioContext.createBufferSource();

        let shiftDownBuffer = createDelayTimeBuffer(this._audioContext, bufferTime, fadeTime, false);
        let shiftUpBuffer = createDelayTimeBuffer(this._audioContext, bufferTime, fadeTime, true);

        this._mod1.buffer = shiftDownBuffer;
        this._mod2.buffer = shiftDownBuffer;
        this._mod3.buffer = shiftUpBuffer;
        this._mod4.buffer = shiftUpBuffer;

        this._mod1.loop = true;
        this._mod2.loop = true;
        this._mod3.loop = true;
        this._mod4.loop = true;

        this._mod1Gain = this._audioContext.createGain();
        this._mod2Gain = this._audioContext.createGain();
        this._mod3Gain = this._audioContext.createGain();
        this._mod4Gain = this._audioContext.createGain();

        this._mod1.connect(this._mod1Gain);
        this._mod2.connect(this._mod2Gain);
        this._mod3.connect(this._mod3Gain);
        this._mod4.connect(this._mod4Gain);

        this._modGain1 = this._audioContext.createGain();
        this._modGain2 = this._audioContext.createGain();

        this._delay1 = this._audioContext.createDelay();
        this._delay2 = this._audioContext.createDelay();

        this._mod1Gain.connect(this._modGain1);
        this._mod2Gain.connect(this._modGain2);
        this._mod3Gain.connect(this._modGain1);
        this._mod4Gain.connect(this._modGain2);

        this._modGain1.connect(this._delay1.delayTime);
        this._modGain2.connect(this._delay2.delayTime);

        this._fade1 = this._audioContext.createBufferSource();
        this._fade2 = this._audioContext.createBufferSource();

        let fadeBuffer = createFadeBuffer(this._audioContext, bufferTime, fadeTime);
        this._fade1.buffer = fadeBuffer;
        this._fade2.buffer = fadeBuffer;
        this._fade1.loop = true;
        this._fade2.loop = true;

        this._mix1 = this._audioContext.createGain();
        this._mix2 = this._audioContext.createGain();

        this._fade1.connect(this._mix1.gain);
        this._fade2.connect(this._mix2.gain);

        this._input.connect(this._delay1);
        this._input.connect(this._delay2);
        this._delay1.connect(this._mix1);
        this._delay2.connect(this._mix2);
        this._mix1.connect(this._wet);
        this._mix2.connect(this._wet);

        this.set(jungleDefaultOptions);
    }

    start() {
        let t = 0.05;
        let t2 = t + this._bufferTime - this._fadeTime;
        this._mod1.start(0, 0, t * 1000);
        this._mod2.start(0, 0, t2 * 1000);
        this._mod3.start(0, 0, t * 1000);
        this._mod4.start(0, 0, t2 * 1000);
        this._fade1.start(0, 0, t * 1000);
        this._fade2.start(0, 0, t2 * 1000);
    }

    stop() {
        this._mod1.stop();
        this._mod2.stop();
        this._mod3.stop();
        this._mod4.stop();
        this._fade1.stop();
        this._fade2.stop();
    }

    set(options: AnyOf<JungleOptions>) {
        if (options.pitchOffset !== undefined) {
            const mul = clamp(options.pitchOffset, Jungle.PITCH_OFFSET_MIN, Jungle.PITCH_OFFSET_MAX);
            if (mul > 0) {
                this._mod1Gain.gain.value = 0;
                this._mod2Gain.gain.value = 0;
                this._mod3Gain.gain.value = 1.0;
                this._mod4Gain.gain.value = 1.0;
            }
            else {
                this._mod1Gain.gain.value = 1.0;
                this._mod2Gain.gain.value = 1.0;
                this._mod3Gain.gain.value = 0;
                this._mod4Gain.gain.value = 0;
            }
            this._setDelay(0.1 * Math.abs(mul));
            this._previousPitch = mul;
        }
    }

    dispose() {
        super.dispose();
        this._mod1.disconnect();
        this._mod2.disconnect();
        this._mod3.disconnect();
        this._mod4.disconnect();
        this._mod1Gain.disconnect();
        this._mod2Gain.disconnect();
        this._mod3Gain.disconnect();
        this._mod4Gain.disconnect();
        this._modGain1.disconnect();
        this._modGain2.disconnect();
        this._fade1.disconnect();
        this._fade2.disconnect();
        this._delay1.disconnect();
        this._delay2.disconnect();
        this._mix1.disconnect();
        this._mix2.disconnect();
    }

    private _setDelay(delayTime: number) {
        this._modGain1.gain.setTargetAtTime(0.5 * delayTime, 0, 0.01 * 1000);
        this._modGain2.gain.setTargetAtTime(0.5 * delayTime, 0, 0.01 * 1000);
    }
}

export const jungleDescriptor = {
    pitchOffset: {
        min: Jungle.PITCH_OFFSET_MIN,
        max: Jungle.PITCH_OFFSET_MAX,
        key: 'pitchOffset',
        title: 'PITCH_OFFSET'
    }
};

export const jungleDefaultOptions = {
    pitchOffset: 1
};