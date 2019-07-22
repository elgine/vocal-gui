export const REDUCER_SET_ZOOM = 'REDUCER_SET_ZOOM';
export const REDUCER_SET_DURATION = 'REDUCER_SET_DURATION';

export const REDUCER_SET_CLIP_REGION = 'REDUCER_SET_CLIP_REGION';

export const ACTION_ZOOM = 'ACTION_ZOOM';
export const ACTION_ZOOM_IN = 'ACTION_ZOOM_IN';
export const ACTION_ZOOM_OUT = 'ACTION_ZOOM_OUT';
export const ACTION_SOURCE_CHANGE = 'ACTION_SOURCE_CHANGE';
export const ACTION_CLIP_REGION_CHANGE = 'ACTION_CLIP_REGION_CHANGE';

export interface TimelineState{
    pixelsPerMSec: number;
    timeUnits: number[];
    duration: number;
    zoom: number;
    clipRegion: number[];
}