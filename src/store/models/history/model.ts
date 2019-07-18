import {
    HistoryState,
    ACTION_UNDO, ACTION_REDO, ACTION_PUSH_STATE,
    REDUCER_SET_STACK_INDEX, REDUCER_PUSH_STATE
} from './types';

const initialState: HistoryState = {
    stateStack: [],
    currentIndex: 0,
    currentState: undefined
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_STACK_INDEX](state: HistoryState, payload: number) {
            if (payload >= state.stateStack.length || payload < 0) return state;
            state.currentIndex = payload;
            state.currentState = state.stateStack[state.currentIndex];
            return state;
        },
        [REDUCER_PUSH_STATE](state: HistoryState, payload: any) {
            let len = state.stateStack.length;
            let index = state.currentIndex;
            state.stateStack.splice(index + 1, len - index - 1, payload);
            state.currentIndex++;
            return state;
        }
    },
    effects: (dispatch: any) => ({
        [ACTION_PUSH_STATE](payload: any) {
            dispatch.history[REDUCER_PUSH_STATE](payload);
        },
        [ACTION_UNDO](payload: any, rootState: any) {
            dispatch.history[REDUCER_SET_STACK_INDEX](rootState.history.currentIndex - 1);
        },
        [ACTION_REDO](payload: any, rootState: any) {
            dispatch.history[REDUCER_SET_STACK_INDEX](rootState.history.currentIndex + 1);
        }
    })
};