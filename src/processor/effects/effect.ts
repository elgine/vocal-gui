export interface EffectOptions{
    gain: number;
}

export default class Effect {

    static GAIN_DEFAULT = 1;
    static GAIN_MIN = 0;
    static GAIN_MAX = 4;

    protected _audioContext: BaseAudioContext;
    protected _gain: GainNode;

    constructor(audioContext: BaseAudioContext) {
        this._audioContext = audioContext;
        this._gain = this._audioContext.createGain();
    }

    start() {

    }

    stop() {

    }

    set<T extends EffectOptions>(options: AnyOf<T>) {
        if (options.gain !== undefined) {
            this._gain.gain.value = options.gain;
        }
    }

    dispose() {
        this._gain.disconnect();
    }

    get input(): AudioNode {
        return this._gain;
    }

    get output() {
        return this._gain;
    }
}

export const effectDescriptor = {
    gain: {
        min: Effect.GAIN_MIN,
        max: Effect.GAIN_MAX,
        key: 'gain',
        title: 'GAIN'
    }
};

export const effectDefaultOptions = {
    gain: Effect.GAIN_DEFAULT
};