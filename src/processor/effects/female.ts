import Effect, { EffectOptions, effectDefaultOptions, effectDescriptor } from './effect';
import Jungle, { JungleOptions, jungleDescriptor, jungleDefaultOptions } from '../composite/jungle';

export interface FemaleOptions extends JungleOptions, EffectOptions{
}

export default class Female extends Effect {

    private _jungle: Jungle;
    private _compressor: DynamicsCompressorNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._jungle = new Jungle(this._audioContext);
        this._compressor = this._audioContext.createDynamicsCompressor();
        this._jungle.output.connect(this._compressor);
        this._compressor.connect(this._gain);

        this.set(femaleDefaultOptions);
    }

    set(options: AnyOf<FemaleOptions>) {
        super.set(options);
        this._jungle.set(options);
    }

    start() {
        this._jungle.start();
    }

    stop() {
        this._jungle.stop();
    }

    dispose() {
        super.dispose();
        this._jungle.dispose();
        this._compressor.disconnect();
    }

    get input() {
        return this._jungle.input;
    }
}

export const femaleDescriptor = {
    ...jungleDescriptor,
    ...effectDescriptor
};

export const femaleDefaultOptions = {
    ...jungleDefaultOptions,
    ...effectDefaultOptions
};