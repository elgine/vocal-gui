import { ACTION_SCALE_TIME, TimelineState } from './types';
import produce from 'immer';

const initialState: TimelineState = {
    pixelsPerMSec: 0.5,
    duration: 0,
    scaleTime: 1
};

export default {
    state: initialState,
    reducers: {
        [ACTION_SCALE_TIME](state: TimelineState, payload: number) {
            if (state.scaleTime === payload) return;
            return produce(state, draft => {
                draft.scaleTime = payload;
            });
        }
    }
};