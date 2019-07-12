export const REDUCER_SET_SCALE_TIME = 'REDUCER_SET_SCALE_TIME';
export const REDUCER_SET_DURATION = 'REDUCER_SET_DURATION';

export const ACTION_SCALE_TIME = 'ACTION_SCALE_TIME';
export const ACTION_SOURCE_CHANGE = 'ACTION_SOURCE_CHANGE';

export interface TimelineState{
    pixelsPerMSec: number;
    timeUnits: number[];
    duration: number;
    scaleTime: number;
}