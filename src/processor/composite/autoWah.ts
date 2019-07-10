import Composite from './composite';
import { clamp } from 'lodash';

export interface AutoWahOptions{
    envelopeFollowerFilterFrequency?: number;
    filterDepth?: number;
    filterQ?: number;
}

export default class AutoWah extends Composite {

    static ENVELOPE_FOLLOWER_FILTER_FREQUENCY_MIN = 0.25;
    static ENVELOPE_FOLLOWER_FILTER_FREQUENCY_DEFAULT = 10;
    static ENVELOPE_FOLLOWER_FILTER_FREQUENCY_MAX = 20;

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
        this._awFollower = this._audioContext.createBiquadFilter();
        this._awDepth = this._audioContext.createGain();
        this._awFilter = this._audioContext.createBiquadFilter();

        this._input.connect(this._waveShaper);
        this._waveShaper.connect(this._awFollower);
        this._awFollower.connect(this._awDepth);
        this._awDepth.connect(this._awFilter.frequency);

        this._input.connect(this._awFilter);
        this._awFilter.connect(this._wet);

        this.set({
            envelopeFollowerFilterFrequency: AutoWah.ENVELOPE_FOLLOWER_FILTER_FREQUENCY_DEFAULT,
            filterDepth: AutoWah.FILTER_DEPTH_DEFAULT,
            filterQ: AutoWah.FILTER_Q_DEFAULT
        });
    }

    dispose() {
        super.dispose();
        this._waveShaper.disconnect();
        this._awFollower.disconnect();
        this._awDepth.disconnect();
        this._awFilter.disconnect();
    }

    set(options: AnyOf<AutoWahOptions>) {
        if (options.envelopeFollowerFilterFrequency !== undefined) {
            this._awFollower.frequency.value = clamp(options.envelopeFollowerFilterFrequency, AutoWah.ENVELOPE_FOLLOWER_FILTER_FREQUENCY_MIN, AutoWah.ENVELOPE_FOLLOWER_FILTER_FREQUENCY_MAX);
        }
        if (options.filterDepth !== undefined) {
            this._awDepth.gain.value = clamp(Math.pow(2, 10 + options.filterDepth), AutoWah.FILTER_DEPTH_MIN, AutoWah.FILTER_DEPTH_MAX);
        }
        if (options.filterQ !== undefined) {
            this._awFilter.Q.value = clamp(options.filterQ, AutoWah.FILTER_Q_MIN, AutoWah.FILTER_Q_MAX);
        }
    }
}