import { EffectType } from './effectType';

export default class Player {

    public readonly audioCtx: AudioContext;
    private _effect: EffectType = EffectType.NONE;

    constructor() {
        this.audioCtx = new AudioContext();
        if (!this.audioCtx) {
            throw new Error('Can not initialize AudioContext, please upgrade your browser to support');
        }
    }

    setEffect(effect: EffectType, initialState?: any) {
        if (this._effect === effect) return;
        this._effect = effect;
        // Build graph
        // TODO:
        this.setEffectState(initialState);
    }

    setEffectState(state: any) {

    }

    play(source: string | AudioBuffer) {
        if (typeof source === 'string') {

        } else {

        }
    }

    stop() {

    }
}