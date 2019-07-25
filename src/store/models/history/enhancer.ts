import { Reducer, Action, combineReducers } from 'redux';
import { } from '@rematch/immer';
import { HistoryState, ACTION_UNDO, ACTION_REDO } from './types';

export interface HistoryEnhancerOptions{
    whiteList?: string[];
    filter?: (v: string) => boolean;
}

export function historyEnhancer<S, A extends Action<string>>(
    reducer: Reducer<S, A>,
    { whiteList, filter }: HistoryEnhancerOptions = {}
) {
    const history: HistoryState<S> = {
        stateStack: [],
        currentIndex: 0,
        currentState: reducer(undefined, { type: 'INIT' } as any)
    };

    const pushState = (state: any) => {
        let len = history.stateStack.length;
        let index = history.currentIndex;
        history.stateStack.splice(index + 1, len - index - 1, state);
        history.currentIndex++;
    };

    const setStateIndex = (index: number) => {
        if (index >= history.stateStack.length || index < 0) return history.currentState;
        history.currentIndex = index;
        history.currentState = history.stateStack[history.currentIndex];
        return history.currentState;
    };

    const isEffetNeedToRecord = (type: string) => {
        if (whiteList) {
            return whiteList.indexOf(type) > -1;
        }
        if (filter) {
            return filter(type);
        }
        return false;
    };

    return (state: S, action: A) => {
        switch (action.type) {
            case ACTION_UNDO:
                return setStateIndex(history.currentIndex - 1);
            case ACTION_REDO:
                return setStateIndex(history.currentIndex + 1);
            default:
            {
                const newState = reducer(state, action);
                if (isEffetNeedToRecord(action.type)) {
                    pushState(newState);
                }
                return newState;
            }
        }
    };
}

export const combineHistoryReducers = (historyReducerOptions: Dictionary<HistoryEnhancerOptions>) => {
    return (reducerMap: Dictionary<Reducer>) => {
        let newReducerMap = {};
        for (let name in reducerMap) {
            if (historyReducerOptions[name]) {
                newReducerMap[name] = historyEnhancer(reducerMap[name], historyReducerOptions[name]);
            } else {
                newReducerMap[name] = reducerMap[name];
            }
        }
        return combineReducers(newReducerMap);
    };
};

export default (options: Dictionary<HistoryEnhancerOptions>) => ({
    config: {
        redux: {
            combineReducers: combineHistoryReducers(options)
        }
    }
});