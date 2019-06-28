export interface TimelineState{
    pixelsPerMSec: number;
    timeUnits: number[];
    duration: number;
    scaleTime: number;
}

export const ACTION_SCALE_TIME = 'ACTION_SCALE_TIME';