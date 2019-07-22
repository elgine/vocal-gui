import ConvolverEffect from './convolverEffect';
import { EffectType } from '../effectType';

export default class BroadRoom extends ConvolverEffect {
    readonly type: EffectType = EffectType.BROAD_ROOM;
}