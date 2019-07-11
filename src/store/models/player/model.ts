import { ACTION_SEEK, PlayerState, ACTION_SET_VOLUME } from './types';
import produce from 'immer';

const initialState: PlayerState = {
    currentTime: 0,
    volume: 1
};

export default {
    state: initialState,
    reducers: {
        [ACTION_SEEK](state: PlayerState, payload: number) {
            if (state.currentTime === payload) return;
            return produce(state, (draft) => {
                draft.currentTime = payload;
            });
        },
        [ACTION_SET_VOLUME](state: PlayerState, payload: number) {
            if (state.volume === payload) return;
            return produce(state, (draft) => {
                draft.volume = payload;
            });
        }
    }
};