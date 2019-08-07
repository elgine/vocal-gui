import {
    WindowState,
    ACTION_WINDOW_STATE_CHANGE,
    REDUCER_SET_WINDOW_STATE
} from './types';

const initialState: WindowState = {
    state: 'normal'
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_WINDOW_STATE](state: WindowState, payload: 'minimize' | 'maximize' | 'normal') {
            state.state = payload;
            return state;
        }
    },
    effects: {
        [ACTION_WINDOW_STATE_CHANGE](payload: string) {
            this[REDUCER_SET_WINDOW_STATE](payload);
        }
    }
};