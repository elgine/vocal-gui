import Effect from './effect';
import Jungle from '../composite/jungle';
import { EffectType } from '../effectType';

export default class Transformer extends Effect {

    readonly type: EffectType = EffectType.TRANSFORMER;

    private _input: GainNode;
    private _jungle1: Jungle;
    private _jungle2: Jungle;
    private _jungle3: Jungle;
    private _jungle4: Jungle;
    private _compressor: DynamicsCompressorNode;

    constructor(audioContext: BaseAudioContext) {
        super(audioContext);
        this._jungle1 = new Jungle(this._audioContext);
        this._jungle2 = new Jungle(this._audioContext);
        this._jungle3 = new Jungle(this._audioContext);
        this._jungle4 = new Jungle(this._audioContext);
        this._compressor = this._audioContext.createDynamicsCompressor();
        this._input = this._audioContext.createGain();

        this._input.connect(this._jungle1.input);
        this._input.connect(this._jungle2.input);
        this._input.connect(this._jungle3.input);
        this._input.connect(this._jungle4.input);

        this._jungle1.output.connect(this._compressor);
        this._jungle2.output.connect(this._compressor);
        this._jungle3.output.connect(this._compressor);
        this._jungle4.output.connect(this._compressor);

        this._compressor.connect(this._gain);

        this._jungle1.set({ pitchOffset: -0.1 });
        this._jungle2.set({ pitchOffset: -0.2 });
        this._jungle3.set({ pitchOffset: -0.4 });
        this._jungle4.set({ pitchOffset: -0.8 });
    }

    dispose() {
        super.dispose();
        this._input.disconnect();
        this._compressor.disconnect();
        this._jungle1.dispose();
        this._jungle2.dispose();
        this._jungle3.dispose();
        this._jungle4.dispose();
    }

    get input() {
        return this._input;
    }
}