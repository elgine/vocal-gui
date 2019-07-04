import { Effect } from '../presets/effects';

export default class Player {

    public readonly audioCtx: AudioContext;

    constructor() {
        this.audioCtx = new AudioContext();
        if (!this.audioCtx) {
            throw new Error('Can not initialize AudioContext, please upgrade your browser to support');
        }
    }

    setEffect(effect: Effect) {

    }


}