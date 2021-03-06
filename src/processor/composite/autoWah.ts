import Composite from './composite';
import { clamp } from 'lodash';
import { buildAutoWahCurve } from '../dsp/createBuffer';

export interface AutoWahOptions{
    envelopeFollowerFilterFreq?: number;
    filterDepth?: number;
    filterQ?: number;
}

export default class AutoWah extends Composite {

    static ENVELOPE_FOLLOWER_FILTER_FREQ_MIN = 0.25;
    static ENVELOPE_FOLLOWER_FILTER_FREQ_DEFAULT = 10;
    static ENVELOPE_FOLLOWER_FILTER_FREQ_MAX = 20;

    static FILTER_DEPTH_DEFAULT = 3.5;
    static FILTER_DEPTH_MIN = 0;
    static FILTER_DEPTH_MAX = 4;

    static FILTER_Q_DEFAULT = 5;
    static FILTER_Q_MIN = 0;
    static FILTER_Q_MAX = 20;

    private _waveShaper: WaveShaperNode;
    private _awFollower: BiquadFilterNode;
    private _awDepth: GainNode;
    private _awFilter: BiquadFilterNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._waveShaper = this._audioContext.createWaveShaper();
        this._waveShaper.curve = buildAutoWahCurve();

        this._awFollower = this._audioContext.createBiquadFilter();
        this._awDepth = this._audioContext.createGain();
        this._awFilter = this._audioContext.createBiquadFilter();
        this._awFilter.frequency.value = 50;

        this._input.connect(this._waveShaper);
        this._waveShaper.connect(this._awFollower);
        this._awFollower.connect(this._awDepth);
        this._awDepth.connect(this._awFilter.frequency);

        this._input.connect(this._awFilter);
        this._awFilter.connect(this._wet);

        this.set(autoWahDefaultOptions);
    }

    dispose() {
        super.dispose();
        this._waveShaper.disconnect();
        this._awFollower.disconnect();
        this._awDepth.disconnect();
        this._awFilter.disconnect();
    }

    set(options: AnyOf<AutoWahOptions>) {
        if (options.envelopeFollowerFilterFreq !== undefined) {
            this._awFollower.frequency.value = clamp(options.envelopeFollowerFilterFreq, AutoWah.ENVELOPE_FOLLOWER_FILTER_FREQ_MIN, AutoWah.ENVELOPE_FOLLOWER_FILTER_FREQ_MAX);
        }
        if (options.filterDepth !== undefined) {
            this._awDepth.gain.value = Math.pow(2, 10 + clamp(options.filterDepth, AutoWah.FILTER_DEPTH_MIN, AutoWah.FILTER_DEPTH_MAX));
        }
        if (options.filterQ !== undefined) {
            this._awFilter.Q.value = clamp(options.filterQ, AutoWah.FILTER_Q_MIN, AutoWah.FILTER_Q_MAX);
        }
    }
}

export const autoWahDescriptor = {
    envelopeFollowerFilterFreq: {
        min: AutoWah.ENVELOPE_FOLLOWER_FILTER_FREQ_MIN,
        max: AutoWah.ENVELOPE_FOLLOWER_FILTER_FREQ_MAX,
        key: 'envelopeFollowerFilterFreq',
        title: 'ENVELOPE_FOLLOWER_FILTER_FREQ'
    },
    filterDepth: {
        min: AutoWah.FILTER_DEPTH_MIN,
        max: AutoWah.FILTER_DEPTH_MAX,
        key: 'filterDepth',
        title: 'FILTER_DEPTH'
    },
    filterQ: {
        min: AutoWah.FILTER_Q_MIN,
        max: AutoWah.FILTER_Q_MAX,
        key: 'filterQ',
        title: 'FILTER_Q'
    }
};

export const autoWahDefaultOptions = {
    envelopeFollowerFilterFreq: AutoWah.ENVELOPE_FOLLOWER_FILTER_FREQ_DEFAULT,
    filterDepth: AutoWah.FILTER_DEPTH_DEFAULT,
    filterQ: AutoWah.FILTER_Q_DEFAULT
};