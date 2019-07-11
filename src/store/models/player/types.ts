export const ACTION_SEEK = 'ACTION_SEEK';
export const ACTION_SET_VOLUME = 'ACTION_SET_VOLUME';

export interface PlayerState{
    currentTime: number;
    volume: number;
}