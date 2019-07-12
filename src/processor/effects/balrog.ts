import { clamp } from 'lodash';
import Effect, { EffectOptions } from './effect';

export interface BalrogOptions extends EffectOptions{
    lfoFreq: number;
    lfoGain: number;
    delay: number;
    highshelfFreq: number;
    highshelfGain: number;
    lowpassFreq: number;
    compressorThreshold: number;
    compressorRatio: number;
    echoGain: number;
    mainGain: number;
    fireGain: number;
}

export default class Balrog extends Effect {

    static LFO_FREQ_DEFAULT = 50.0;
    static LFO_FREQ_MIN = -22050.0;
    static LFO_FREQ_MAX = 22050.0;

    static LFO_GAIN_DEFAULT = 0.004;
    static LFO_GAIN_MIN = 0.0;
    static LFO_GAIN_MAX = 4.0;

    static DELAY_DEFAULT = 0.01;
    static DELAY_MIN = 0.0;
    static DELAY_MAX = 1.0;

    static HIGHSHELF_FREQ_DEFAULT = 1000.0;
    static HIGHSHELF_FREQ_MIN = Number.MIN_SAFE_INTEGER;
    static HIGHSHELF_FREQ_MAX = Number.MAX_SAFE_INTEGER;

    static HIGHSHELF_GAIN_DEFAULT = 10.0;
    static HIGHSHELF_GAIN_MIN = Number.MIN_SAFE_INTEGER;
    static HIGHSHELF_GAIN_MAX = Number.MAX_SAFE_INTEGER;

    static LOWPASS_FREQ_DEFAULT = 2000.0;
    static LOWPASS_FREQ_MIN = Number.MIN_SAFE_INTEGER;
    static LOWPASS_FREQ_MAX = Number.MAX_SAFE_INTEGER;

    static COMPRESSOR_THRESHOLD_DEFAULT = -50.0;
    static COMPRESSOR_THRESHOLD_MIN = -100;
    static COMPRESSOR_THRESHOLD_MAX = 0;

    static COMPRESSOR_RATIO_DEFAULT = 16.0;
    static COMPRESSOR_RATIO_MIN = 1;
    static COMPRESSOR_RATIO_MAX = 20;

    static ECHO_GAIN_DEFAULT = 0.5;
    static ECHO_GAIN_MIN = 0.0;
    static ECHO_GAIN_MAX = 1.0;

    static MAIN_GAIN_DEFAULT = 2.0;
    static MAIN_GAIN_MIN = 0.0;
    static MAIN_GAIN_MAX = 4.0;

    static FIRE_GAIN_DEFAULT = 0.3;
    static FIRE_GAIN_MIN = 0.0;
    static FIRE_GAIN_MAX = 4.0;

    private _filter: BiquadFilterNode;
    private _compressor: DynamicsCompressorNode;
    private _delay: DelayNode;
    private _convolver: ConvolverNode;
    private _osc: OscillatorNode;
    private _oscGain: GainNode;
    private _convolverGain: GainNode;
    private _fireGain: GainNode;
    private _noConvGain: GainNode;
    private _fire: AudioBufferSourceNode;
    private _filter2: BiquadFilterNode;

    constructor(audioContext: BaseAudioContext, kernelBuffer: AudioBuffer, fireBuffer: AudioBuffer) {
        super(audioContext);
        this._filter = this._audioContext.createBiquadFilter();
        this._filter.type = 'highshelf';

        this._compressor = this._audioContext.createDynamicsCompressor();

        this._delay = this._audioContext.createDelay();

        this._osc = this._audioContext.createOscillator();
        this._osc.type = 'sawtooth';

        this._oscGain = this._audioContext.createGain();

        this._convolver = this._audioContext.createConvolver();
        this._convolver.buffer = kernelBuffer;

        this._convolverGain = this._audioContext.createGain();

        this._fire = this._audioContext.createBufferSource();
        this._fire.buffer = fireBuffer;
        this._fire.loop = true;

        this._fireGain = this._audioContext.createGain();

        this._filter2 = this._audioContext.createBiquadFilter();
        this._filter2.type = 'lowpass';

        this._noConvGain = this._audioContext.createGain();

        this._osc.connect(this._oscGain);
        this._oscGain.connect(this._delay.delayTime);
        this._delay.connect(this._convolver);
        this._convolver.connect(this._convolverGain);
        this._convolverGain.connect(this._filter);
        this._filter.connect(this._compressor);
        this._compressor.connect(this._gain);
        this._delay.connect(this._filter2);
        this._filter2.connect(this._filter);
        this._filter.connect(this._noConvGain);
        this._noConvGain.connect(this._compressor);
        this._fire.connect(this._fireGain);
        this._fireGain.connect(this._gain);

        this.set(balrogDefaultOptions);
    }

    set(options: AnyOf<BalrogOptions>) {
        super.set(options);
        if (options.lfoFreq !== undefined) {
            this._osc.frequency.value = clamp(options.lfoFreq, Balrog.LFO_FREQ_MIN, Balrog.LFO_FREQ_MAX);
        }
        if (options.lfoGain !== undefined) {
            this._oscGain.gain.value = clamp(options.lfoGain, Balrog.LFO_GAIN_MIN, Balrog.LFO_GAIN_MAX);
        }
        if (options.delay !== undefined) {
            this._delay.delayTime.value = clamp(options.delay, Balrog.DELAY_MIN, Balrog.DELAY_MAX);
        }
        if (options.highshelfFreq !== undefined) {
            this._filter.frequency.value = clamp(options.highshelfFreq, Balrog.HIGHSHELF_FREQ_MIN, Balrog.HIGHSHELF_FREQ_MAX);
        }
        if (options.highshelfGain !== undefined) {
            this._filter.gain.value = clamp(options.highshelfGain, Balrog.HIGHSHELF_GAIN_MIN, Balrog.HIGHSHELF_GAIN_MAX);
        }
        if (options.lowpassFreq !== undefined) {
            this._filter2.frequency.value = clamp(options.lowpassFreq, Balrog.LOWPASS_FREQ_MIN, Balrog.LOWPASS_FREQ_MAX);
        }
        if (options.compressorThreshold !== undefined) {
            this._compressor.threshold.value = clamp(options.compressorThreshold, Balrog.COMPRESSOR_THRESHOLD_MIN, Balrog.COMPRESSOR_THRESHOLD_MAX);
        }
        if (options.compressorRatio !== undefined) {
            this._compressor.ratio.value = clamp(options.compressorRatio, Balrog.COMPRESSOR_RATIO_MIN, Balrog.COMPRESSOR_RATIO_MAX);
        }
        if (options.echoGain !== undefined) {
            this._convolverGain.gain.value = clamp(options.echoGain, Balrog.ECHO_GAIN_MIN, Balrog.ECHO_GAIN_MAX);
        }
        if (options.mainGain !== undefined) {
            this._noConvGain.gain.value = clamp(options.mainGain, Balrog.MAIN_GAIN_MIN, Balrog.MAIN_GAIN_MAX);
        }
        if (options.fireGain !== undefined) {
            this._fireGain.gain.value = clamp(options.fireGain, Balrog.FIRE_GAIN_MIN, Balrog.FIRE_GAIN_MAX);
        }
    }

    dispose() {
        super.dispose();
        this._filter.disconnect();
        this._compressor.disconnect();
        this._delay.disconnect();
        this._osc.disconnect();
        this._oscGain.disconnect();
        this._convolver.disconnect();
        this._convolverGain.disconnect();
        this._fire.disconnect();
        this._fireGain.disconnect();
        this._filter2.disconnect();
        this._noConvGain.disconnect();
    }

    start() {
        this._fire.start();
        this._osc.start();
    }

    stop() {
        this._fire.stop();
        this._osc.stop();
    }

    get input() {
        return this._delay;
    }
}

export const balrogDefaultOptions = {
    lfoFreq: Balrog.LFO_FREQ_DEFAULT,
    lfoGain: Balrog.LFO_GAIN_DEFAULT,
    delay: Balrog.DELAY_DEFAULT,
    highshelfFreq: Balrog.HIGHSHELF_FREQ_DEFAULT,
    highshelfGain: Balrog.HIGHSHELF_GAIN_DEFAULT,
    lowpassFreq: Balrog.LOWPASS_FREQ_DEFAULT,
    compressorThreshold: Balrog.COMPRESSOR_THRESHOLD_DEFAULT,
    compressorRatio: Balrog.COMPRESSOR_RATIO_DEFAULT,
    echoGain: Balrog.ECHO_GAIN_DEFAULT,
    mainGain: Balrog.MAIN_GAIN_DEFAULT,
    fireGain: Balrog.FIRE_GAIN_DEFAULT
};