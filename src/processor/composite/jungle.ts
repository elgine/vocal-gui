import { clamp } from 'lodash';
import Composite from './composite';

function createFadeBuffer(context: AudioContext, activeTime: number, fadeTime: number) {
    let length1 = activeTime * context.sampleRate;
    let length2 = (activeTime - 2 * fadeTime) * context.sampleRate;
    let length = length1 + length2;
    let buffer = context.createBuffer(1, length, context.sampleRate);
    let p = buffer.getChannelData(0);

    console.log('createFadeBuffer() length = ' + length);

    let fadeLength = fadeTime * context.sampleRate;

    let fadeIndex1 = fadeLength;
    let fadeIndex2 = length1 - fadeLength;

    // 1st part of cycle
    for (let i = 0; i < length1; ++i) {
        let value = 0;
        if (i < fadeIndex1) {
            value = Math.sqrt(i / fadeLength);
        } else if (i >= fadeIndex2) {
            value = Math.sqrt(1 - (i - fadeIndex2) / fadeLength);
        } else {
            value = 1;
        }

        p[i] = value;
    }

    // 2nd part
    for (let i = length1; i < length; ++i) {
        p[i] = 0;
    }


    return buffer;
}

function createDelayTimeBuffer(context: AudioContext, activeTime: number, fadeTime: number, shiftUp: boolean) {
    let length1 = activeTime * context.sampleRate;
    let length2 = (activeTime - 2 * fadeTime) * context.sampleRate;
    let length = length1 + length2;
    let buffer = context.createBuffer(1, length, context.sampleRate);
    let p = buffer.getChannelData(0);

    console.log('createDelayTimeBuffer() length = ' + length);

    // 1st part of cycle
    for (let i = 0; i < length1; ++i) {
        if (shiftUp)
        // This line does shift-up transpose
        { p[i] = (length1 - i) / length }
        else
        // This line does shift-down transpose
        { p[i] = i / length1 }
    }

    // 2nd part
    for (let i = length1; i < length; ++i) {
        p[i] = 0;
    }

    return buffer;
}

export interface JungleOptions{
    pitchOffset: number;
}

export default class Jungle extends Composite {

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

    constructor(audioContext: AudioContext, delayTime: number = 0.1, fadeTime: number = 0.05, bufferTime: number = 0.1) {
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

        this.set({
            pitchOffset: 1
        });
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
            const mul = options.pitchOffset;
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