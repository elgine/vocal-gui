import { EffectType } from '../../../processor/effectType';

export const REDUCER_SET_EFFECT = 'REDUCER_SET_EFFECT';
export const REDUCER_SET_EFFECT_OPTIONS = 'REDUCER_SET_EFFECT_OPTIONS';

export const ACTION_SWITCH_EFFECT = 'ACTION_SWITCH_EFFECT';
export const ACTION_EFFECT_OPTIONS_CHANGE = 'ACTION_EFFECT_OPTIONS_CHANGE';

export interface EffectState{
    effect: EffectType;
    effectOptions: any;
}