export const ACTION_WINDOW_STATE_CHANGE = 'ACTION_WINDOW_STATE_CHANGE';
export const REDUCER_SET_WINDOW_STATE = 'REDUCER_SET_WINDOW_STATE';

export interface WindowState{
    state: 'minimize' | 'maximize' | 'normal';
}