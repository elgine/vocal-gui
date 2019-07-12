import {RematchDispatch} from "@rematch/core";
import {
    ACTION_SEEK, PlayerState, ACTION_SET_VOLUME, ACTION_SET_PLAYBACK_SPEED,
    ACTION_SET_EFFECT, ACTION_SET_EFFECT_OPTIONS, ACTION_PLAY, ACTION_STOP, 
    REDUCER_SET_CURRENT_TIME, REDUCER_SET_VOLUME, REDUCER_SET_PLAYBACK_SPEED, 
    REDUCER_SET_EFFECT, REDUCER_SET_EFFECT_OPTIONS, REDUCER_SET_PLAYING
} from './types';
import { EffectType } from '../../../processor/effectType';
import { merge } from 'lodash';
import { createEffectOptions } from '../../../processor/effects/factory';

const initialState: PlayerState = {
    playing: false,
    currentTime: 0,
    volume: 1,
    playbackSpeed: 1,
    effect: EffectType.NONE,
    effectOptions: {}
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_PLAYING](state: PlayerState, payload: boolean){
            state.playing = payload;
            return state;
        },
        [REDUCER_SET_CURRENT_TIME](state: PlayerState, payload: number) {
            state.currentTime = payload;
            return state;
        },
        [REDUCER_SET_VOLUME](state: PlayerState, payload: number) {
            state.volume = payload;
            return state;
        },
        [REDUCER_SET_PLAYBACK_SPEED](state: PlayerState, payload: number) {
            state.playbackSpeed = payload;
            return state;
        },
        [REDUCER_SET_EFFECT](state: PlayerState, payload: EffectType) {
            state.effect = payload;
            return state;
        },
        [REDUCER_SET_EFFECT_OPTIONS](state: PlayerState, payload: any) {
            state.effectOptions = merge(state.effectOptions, payload);
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        [ACTION_PLAY](payload: any, rootState: any){
            dispatch.player[REDUCER_SET_PLAYING](true);
        },
        [ACTION_STOP](payload: any, rootState: any){
            dispatch.player[REDUCER_SET_PLAYING](false);
        },
        [ACTION_SEEK](payload: number, rootState: any){
            dispatch.player[REDUCER_SET_CURRENT_TIME](payload);
        },
        [ACTION_SET_PLAYBACK_SPEED](payload: number, rootState: any){
            dispatch.player[REDUCER_SET_PLAYBACK_SPEED](payload);
        },
        [ACTION_SET_EFFECT](payload: EffectType, rootState: any){
            dispatch.player[REDUCER_SET_EFFECT](payload);
            dispatch.player[REDUCER_SET_EFFECT_OPTIONS](createEffectOptions(payload));
        },
        [ACTION_SET_EFFECT_OPTIONS](payload: any, rootState: any){
            dispatch.player[REDUCER_SET_EFFECT_OPTIONS](payload);
        },
        [ACTION_SET_VOLUME](payload: number, rootState: any){
            dispatch.player[REDUCER_SET_VOLUME](payload);
        }
    })
};