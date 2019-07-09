import Composite from './composite';
import { clamp } from 'lodash';

export interface Equalizer3BandOptions{
    peakingGain: number;
    lowshelfGain: number;
    highshelfGain: number;
}

export default class Equalizer3Band extends Composite {

    static LOWSHELF_GAIN_DEFAULT = 1.0;
    static LOWSHELF_GAIN_MIN = -127.0;
    static LOWSHELF_GAIN_MAX = 12.0;

    static PEAKING_GAIN_DEFAULT = -7.0;
    static PEAKING_GAIN_MIN = -127.0;
    static PEAKING_GAIN_MAX = 12.0;

    static HIGHSHELF_GAIN_DEFAULT = -10.0;
    static HIGHSHELF_GAIN_MIN = -127.0;
    static HIGHSHELF_GAIN_MAX = 12.0;

    private _hi: BiquadFilterNode;
    private _lo: BiquadFilterNode;
    private _mi: BiquadFilterNode;

    constructor(audioContext: AudioContext) {
        super(audioContext);

        this._hi = this._audioContext.createBiquadFilter();
        this._hi.type = 'highshelf';
        this._hi.frequency.value = 2500;
        this._hi.gain.value = -10;

        this._lo = this._audioContext.createBiquadFilter();
        this._lo.type = 'lowshelf';
        this._lo.frequency.value = 100;
        this._lo.gain.value = 1;

        this._mi = this._audioContext.createBiquadFilter();
        this._mi.type = 'peaking';
        this._mi.frequency.value = 900;
        this._mi.gain.value = -7;

        this._input.connect(this._hi);
        this._hi.connect(this._mi);
        this._mi.connect(this._lo);
        this._lo.connect(this._wet);

        this.set({
            lowshelfGain: Equalizer3Band.LOWSHELF_GAIN_DEFAULT,
            peakingGain: Equalizer3Band.PEAKING_GAIN_DEFAULT,
            highshelfGain: Equalizer3Band.HIGHSHELF_GAIN_DEFAULT
        });
    }

    set(options: AnyOf<Equalizer3BandOptions>) {
        if (options.lowshelfGain !== undefined) {
            this._lo.gain.value = clamp(options.lowshelfGain, Equalizer3Band.LOWSHELF_GAIN_MIN, Equalizer3Band.LOWSHELF_GAIN_MAX);
        }
        if (options.peakingGain !== undefined) {
            this._mi.gain.value = clamp(options.peakingGain, Equalizer3Band.PEAKING_GAIN_MIN, Equalizer3Band.PEAKING_GAIN_MAX);
        }
        if (options.highshelfGain !== undefined) {
            this._hi.gain.value = clamp(options.highshelfGain, Equalizer3Band.HIGHSHELF_GAIN_MIN, Equalizer3Band.HIGHSHELF_GAIN_MAX);
        }
    }

    dispose() {
        super.dispose();
        this._lo.disconnect();
        this._mi.disconnect();
        this._hi.disconnect();
    }
}