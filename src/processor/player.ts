import { EffectType } from './effectType';
import { createEffect } from './effects/factory';
import Effect from './effects/effect';

export default class Player {

    public readonly audioCtx: AudioContext;
    private _effectType: EffectType = EffectType.NONE;
    private _effect: Effect|null = null;
    private _input: AudioBufferSourceNode;
    private _gain: GainNode;
    private _playing: boolean = false;

    constructor() {
        this.audioCtx = new AudioContext();
        if (!this.audioCtx) {
            throw new Error('Can not initialize AudioContext, please upgrade your browser to support');
        }
        this._input = this.audioCtx.createBufferSource();
        this._gain = this.audioCtx.createGain();
        this._input.connect(this._gain);
        this._gain.connect(this.audioCtx.destination);
    }

    async setEffect(effectType: EffectType, initialState?: any) {
        if (this._effectType === effectType) return;
        this._effectType = effectType;
        this._effect = await createEffect(this._effectType, this.audioCtx);
        this._input.disconnect();
        if (this._effect) {
            this._input.connect(this._effect.input);
            this._effect.output.connect(this._gain);
        } else {
            this._input.connect(this._gain);
        }
        this.setEffectState(initialState);
    }

    setEffectState(state: any) {
        if (this._effect) {
            this._effect.set(state);
        }
    }

    setSource(source: AudioBuffer) {
        this._input.buffer = source;
    }

    seek(time: number) {
        this._input.start(0, time * 0.001);
        if (!this._playing) { this._input.stop() }
    }

    play(time: number = 0) {
        this._playing = true;
        this.seek(time);
    }

    stop() {
        this._playing = false;
        this._input.stop();
    }
}