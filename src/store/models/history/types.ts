export const ACTION_UNDO = 'ACTION_UNDO';
export const ACTION_REDO = 'ACTION_REDO';
export const ACTION_PUSH_STATE = 'ACTION_PUSH_STATE';

export const REDUCER_PUSH_STATE = 'REDUCER_PUSH_STATE';
export const REDUCER_SET_STACK_INDEX = 'REDUCER_SET_STACK_INDEX';

export interface HistoryState{
    currentIndex: number;
    stateStack: any[];
    currentState: any;
}