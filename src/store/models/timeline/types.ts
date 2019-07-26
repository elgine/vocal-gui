export const REDUCER_SET_ZOOM = 'REDUCER_SET_ZOOM';
export const REDUCER_SET_DURATION = 'REDUCER_SET_DURATION';
export const REDUCER_SET_CURRENT_TIME = 'REDUCER_SET_CURRENT_TIME';
export const REDUCER_SET_CLIP_REGION = 'REDUCER_SET_CLIP_REGION';

export const ACTION_ZOOM = 'ACTION_ZOOM';
export const ACTION_ZOOM_IN = 'ACTION_ZOOM_IN';
export const ACTION_ZOOM_OUT = 'ACTION_ZOOM_OUT';
export const ACTION_SOURCE_CHANGE = 'ACTION_SOURCE_CHANGE';
export const ACTION_CLIP_REGION_CHANGE = 'ACTION_CLIP_REGION_CHANGE';
export const ACTION_SKIP_PREVIOUS = 'ACTION_SKIP_PREVIOUS';
export const ACTION_SEEK = 'ACTION_SEEK';
export const ACTION_SKIP_NEXT = 'ACTION_SKIP_NEXT';

export interface TimelineState{
    pixelsPerMSec: number;
    baseTimeUnit: number;
    timeUnits: number[];
    duration: number;
    currentTime: number;
    clipRegion: number[];
    zoom: number;
    zoomUnit: {
        in: number;
        out: number;
    };
}