import { RematchDispatch } from '@rematch/core';
import { clamp } from 'lodash';
import {
    PlayerState,
    REDUCER_SET_VOLUME,
    REDUCER_SET_PLAYING,
    REDUCER_SET_REPEAT,
    ACTION_SET_VOLUME,
    ACTION_PLAY,
    ACTION_STOP,
    ACTION_SWITCH_REPEAT,
    ACTION_SWITCH_PLAYING
} from './types';
import { StateWithHistory } from 'redux-undo';

const initialState: PlayerState = {
    repeat: false,
    playing: false,
    volume: 1
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_REPEAT](state: PlayerState, payload: boolean) {
            state.repeat = payload;
            return state;
        },
        [REDUCER_SET_PLAYING](state: PlayerState, payload: boolean) {
            state.playing = payload;
            return state;
        },
        [REDUCER_SET_VOLUME](state: PlayerState, payload: number) {
            state.volume = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => {
        return {
            [ACTION_SWITCH_PLAYING](payload: any, { present }: StateWithHistory<any>) {
                if (!present.player.playing) {
                    dispatch.player[ACTION_PLAY]();
                } else {
                    dispatch.player[ACTION_STOP]();
                }
            },
            [ACTION_SWITCH_REPEAT](payload: any, { present }: StateWithHistory<any>) {
                dispatch.player[REDUCER_SET_REPEAT](!present.player.repeat);
            },
            async [ACTION_PLAY](payload: any) {
                dispatch.player[REDUCER_SET_PLAYING](true);
            },
            [ACTION_STOP](payload: any) {
                dispatch.player[REDUCER_SET_PLAYING](false);
            },
            [ACTION_SET_VOLUME](payload: number) {
                dispatch.player[REDUCER_SET_VOLUME](clamp(payload, 0, 1));
            }
        };
    }
};