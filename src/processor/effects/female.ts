import Effect, { EffectOptions, effectDefaultOptions, effectDescriptor } from './effect';
import Jungle, { JungleOptions, jungleDescriptor, jungleDefaultOptions } from '../composite/jungle';
import { EffectType } from '../effectType';

export interface FemaleOptions extends JungleOptions, EffectOptions{
}

export default class Female extends Effect {

    readonly type: EffectType = EffectType.FEMALE;

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
    pitchOffset: 0.45,
    ...effectDefaultOptions
};