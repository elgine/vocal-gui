import { Reducer, combineReducers } from 'redux';
import  undoable, { UndoableOptions } from 'redux-undo';
import { Plugin } from '@rematch/core';

export const combineHistoryReducers = (options: UndoableOptions) => {
    return (reducers: Dictionary<Reducer>) => {
        return undoable(combineReducers(reducers), options);
    };
};

export default (options: UndoableOptions): Plugin => ({
    config: {
        redux: {
            initialState: {
                past: [],
                present: undefined,
                future: []
            },
            combineReducers: combineHistoryReducers(options)
        }
    }
});