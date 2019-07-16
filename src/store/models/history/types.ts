export const ACTION_UNDO = 'ACTION_UNDO';
export const ACTION_REDO = 'ACTION_REDO';

export interface HistoryState{
    currentIndex: number;
    stateStack: any[];
}