export const REDUCER_SET_PLAYING = 'REDUCER_SET_PLAYING';
export const REDUCER_SET_VOLUME = 'REDUCER_SET_VOLUME';
export const REDUCER_SET_REPEAT = 'REDUCER_SET_REPEAT';

export const ACTION_SWITCH_REPEAT = 'ACTION_SWITCH_REPEAT';
export const ACTION_SWITCH_PLAYING = 'ACTION_SWITCH_PLAYING';
export const ACTION_PLAY = 'ACTION_PLAY';
export const ACTION_STOP = 'ACTION_STOP';
export const ACTION_SET_VOLUME = 'ACTION_SET_VOLUME';
export const ACTION_START_PLAYING = 'ACTION_START_PLAYING';
export const ACTION_STOP_PLAYING = 'ACTION_STOP_PLAYING';

export interface PlayerState{
    repeat: boolean;
    playing: boolean;
    volume: number;
}