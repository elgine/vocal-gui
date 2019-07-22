import ConvolverEffect from './convolverEffect';
import { EffectType } from '../effectType';

export default class Muffler extends ConvolverEffect {
    readonly type: EffectType = EffectType.MUFFLER;
}