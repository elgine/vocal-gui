import { ACTION_UNDO, ACTION_REDO, HistoryState } from './types';

const initialState: HistoryState = {
    stateStack: [],
    currentIndex: 0
};

export default {
    state: initialState,
    reducers: {},
    effects: {
        [ACTION_UNDO]() {

        },
        [ACTION_REDO]() {

        }
    }
};