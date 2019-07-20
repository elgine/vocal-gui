import { RematchDispatch } from '@rematch/core';
import {
    EffectState,
    REDUCER_SET_EFFECT,
    REDUCER_SET_EFFECT_OPTIONS,
    ACTION_SWITCH_EFFECT,
    ACTION_CHANGE_EFFECT_OPTIONS
} from './type';
import { EffectType } from '../../../processor/effectType';
import { effectDefaultOptions } from '../../../processor/effects/effect';
import { createEffectOptions } from '../../../processor/effects/factory';

const initialState: EffectState = {
    effect: EffectType.NONE,
    effectOptions: effectDefaultOptions
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_EFFECT](state: EffectState, payload: EffectType) {
            state.effect = payload;
            return state;
        },
        [REDUCER_SET_EFFECT_OPTIONS](state: EffectState, payload: any) {
            state.effectOptions = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        [ACTION_SWITCH_EFFECT](payload: EffectType) {
            dispatch.effect[REDUCER_SET_EFFECT](payload);
            dispatch.effect[REDUCER_SET_EFFECT_OPTIONS](createEffectOptions(payload));
        },
        [ACTION_CHANGE_EFFECT_OPTIONS](payload: any) {
            dispatch.effect[REDUCER_SET_EFFECT_OPTIONS](payload);
        }
    })
};