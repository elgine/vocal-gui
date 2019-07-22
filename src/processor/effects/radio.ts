import ConvolverEffect from './convolverEffect';
import { EffectType } from '../effectType';

export default class Radio extends ConvolverEffect {
    readonly type: EffectType = EffectType.RADIO;
}