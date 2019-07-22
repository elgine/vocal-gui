import ConvolverEffect from './convolverEffect';
import { EffectType } from '../effectType';

export default class Cave extends ConvolverEffect {
    readonly type: EffectType = EffectType.CAVE;
}