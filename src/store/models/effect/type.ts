import { EffectType } from '../../../processor/effectType';

export const REDUCER_SET_EFFECT = 'REDUCER_SET_EFFECT';
export const REDUCER_SET_EFFECT_OPTIONS = 'REDUCER_SET_EFFECT_OPTIONS';

export const ACTION_SWITCH_EFFECT = 'ACTION_SWITCH_EFFECT';
export const ACTION_CHANGE_EFFECT_OPTIONS = 'ACTION_CHANGE_EFFECT_OPTIONS';

export interface EffectState{
    effect: EffectType;
    effectOptions: any;
}