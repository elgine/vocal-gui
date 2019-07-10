import Effect from './effect';

export default class ConvolverEffect extends Effect {

    private _convolver: ConvolverNode;

    constructor(audioContext: BaseAudioContext, kernel: AudioBuffer) {
        super(audioContext);
        this._convolver = this._audioContext.createConvolver();
        this._convolver.buffer = kernel;
        this._convolver.connect(this._gain);
    }

    dispose() {
        super.dispose();
        this._convolver.disconnect();
    }

    get input() {
        return this._convolver;
    }
}