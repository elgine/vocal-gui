export interface EffectOptions{
    gain: number;
}

export default class Effect {

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