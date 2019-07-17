import { RematchDispatch } from '@rematch/core';
import { clamp } from 'lodash';
import {
    ACTION_SEEK, PlayerState, ACTION_SET_VOLUME, ACTION_SET_PLAYBACK_SPEED,
    ACTION_PLAY, ACTION_STOP, ACTION_SWITCH_REPEAT, ACTION_SWITCH_PLAYING,
    ACTION_SKIP_PREVIOUS, ACTION_SKIP_NEXT, ACTION_SOURCE_CHANGE,
    REDUCER_SET_CURRENT_TIME, REDUCER_SET_VOLUME, REDUCER_SET_PLAYBACK_SPEED,
    REDUCER_SET_PLAYING, REDUCER_SET_REPEAT, REDUCER_SET_DURATION
} from './types';

const initialState: PlayerState = {
    repeat: false,
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackSpeed: 1
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_DURATION](state: PlayerState, payload: number) {
            state.duration = payload;
            return state;
        },
        [REDUCER_SET_REPEAT](state: PlayerState, payload: boolean) {
            state.repeat = payload;
            return state;
        },
        [REDUCER_SET_PLAYING](state: PlayerState, payload: boolean) {
            state.playing = payload;
            return state;
        },
        [REDUCER_SET_CURRENT_TIME](state: PlayerState, payload: number) {
            state.currentTime = clamp(payload, 0, state.duration);
            return state;
        },
        [REDUCER_SET_VOLUME](state: PlayerState, payload: number) {
            state.volume = payload;
            return state;
        },
        [REDUCER_SET_PLAYBACK_SPEED](state: PlayerState, payload: number) {
            state.playbackSpeed = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        [ACTION_SOURCE_CHANGE](payload: AudioBuffer) {
            dispatch.player[REDUCER_SET_DURATION](payload.duration * 1000);
        },
        [ACTION_SKIP_PREVIOUS](payload: any, rootState: any) {
            dispatch.player[ACTION_SEEK](rootState.timeline.clipRegion.start);
        },
        [ACTION_SKIP_NEXT](payload: any, rootState: any) {
            dispatch.player[ACTION_SEEK](rootState.timeline.clipRegion.end);
        },
        [ACTION_SWITCH_REPEAT](payload: any, rootState: any) {
            if (rootState.player.repeat) {
                dispatch.player[REDUCER_SET_REPEAT](false);
            } else {
                dispatch.player[REDUCER_SET_REPEAT](true);
            }
        },
        [ACTION_SWITCH_PLAYING](payload: any, rootState: any) {
            if (rootState.player.playing) {
                dispatch.player[ACTION_PLAY]();
            } else {
                dispatch.player[ACTION_STOP]();
            }
        },
        [ACTION_PLAY](payload: any, rootState: any) {
            dispatch.player[REDUCER_SET_PLAYING](true);
        },
        [ACTION_STOP](payload: any, rootState: any) {
            dispatch.player[REDUCER_SET_PLAYING](false);
        },
        [ACTION_SEEK](payload: number, rootState: any) {
            dispatch.player[REDUCER_SET_CURRENT_TIME](payload);
        },
        [ACTION_SET_PLAYBACK_SPEED](payload: number, rootState: any) {
            dispatch.player[REDUCER_SET_PLAYBACK_SPEED](payload);
        },
        [ACTION_SET_VOLUME](payload: number, rootState: any) {
            dispatch.player[REDUCER_SET_VOLUME](payload);
        }
    })
};