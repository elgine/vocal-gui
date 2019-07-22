import ConvolverEffect from './convolverEffect';
import { EffectType } from '../effectType';

export default class Hall extends ConvolverEffect {
    readonly type: EffectType = EffectType.HALL;
}