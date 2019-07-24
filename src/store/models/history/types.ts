export const ACTION_UNDO = 'ACTION_UNDO';
export const ACTION_REDO = 'ACTION_REDO';
export const ACTION_SET_HISTORY = 'ACTION_SET_HISTORY';

export const REDUCER_PUSH_STATE = 'REDUCER_PUSH_STATE';
export const REDUCER_SET_STACK_INDEX = 'REDUCER_SET_STACK_INDEX';

export interface HistoryState<S>{
    currentIndex: number;
    stateStack: S[];
    currentState: S;
}