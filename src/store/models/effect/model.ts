import { batch } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import {
    EffectState,
    REDUCER_SET_EFFECT,
    REDUCER_SET_EFFECT_OPTIONS,
    ACTION_SWITCH_EFFECT,
    ACTION_CHANGE_EFFECT_OPTIONS
} from './type';
import { EffectType } from '../../../processor/effectType';
import { getEffectOptions } from '../../../processor/effects/factory';
import { getPlayer } from '../../../processor';

const initialState: EffectState = {
    effect: EffectType.NONE,
    effectOptions: getEffectOptions(EffectType.NONE)
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_EFFECT](state: EffectState, payload: EffectType) {
            state.effect = payload;
            return state;
        },
        [REDUCER_SET_EFFECT_OPTIONS](state: EffectState, payload: any) {
            /* eslint-disable */
            for (let k in payload) {
                state.effectOptions[k] = payload[k];
            }
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        async [ACTION_SWITCH_EFFECT](payload: EffectType) {
            const player = getPlayer();
            await player.setEffect(payload);
            batch(() => {
                dispatch.effect[REDUCER_SET_EFFECT](payload);
                dispatch.effect[REDUCER_SET_EFFECT_OPTIONS](getEffectOptions(payload));
            });
        },
        [ACTION_CHANGE_EFFECT_OPTIONS](payload: any, rootState: any) {
            const player = getPlayer();
            player.setEffectState(payload);
            dispatch.effect[REDUCER_SET_EFFECT_OPTIONS](payload);
        }
    })
};