import { RematchDispatch, ModelConfig } from '@rematch/core';
import { clamp } from 'lodash';
import {
    TimelineState,
    ACTION_ZOOM,
    ACTION_CLIP_REGION_CHANGE,
    ACTION_SOURCE_CHANGE,
    REDUCER_SET_DURATION,
    REDUCER_SET_ZOOM,
    REDUCER_SET_CLIP_REGION,
    ACTION_ZOOM_IN,
    ACTION_ZOOM_OUT
} from './types';
import { TIME_UNITS, PIXELS_PER_TIME_UNIT, ZOOM_MAXIMUM, ZOOM_MINIMUM } from '../../../constant';
import calcProperTimeUnits from './calcProperTimeUnits';

const initialState: TimelineState = {
    pixelsPerMSec: 0.01,
    duration: 0,
    zoom: 1,
    timeUnits: TIME_UNITS,
    clipRegion: {
        start: 0,
        end: 0
    }
};

const timelineModel: ModelConfig<TimelineState> = {
    state: initialState,
    reducers: {
        [REDUCER_SET_ZOOM](state: TimelineState, payload: number) {
            state.zoom = payload;
            state.timeUnits = calcProperTimeUnits(~~(TIME_UNITS[0] / state.zoom));
            state.pixelsPerMSec = PIXELS_PER_TIME_UNIT / state.timeUnits[0];
            return state;
        },
        [REDUCER_SET_DURATION](state: TimelineState, payload: number) {
            state.duration = payload;
            state.clipRegion.start = 0;
            state.clipRegion.end = payload;
            return state;
        },
        [REDUCER_SET_CLIP_REGION](state: TimelineState, payload: {start: number; end: number}) {
            state.clipRegion = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        [ACTION_ZOOM](payload: number) {
            dispatch.timeline[REDUCER_SET_ZOOM](payload);
        },
        [ACTION_ZOOM_IN](payload: any, rootState: any) {
            dispatch.timeline[REDUCER_SET_ZOOM](clamp(rootState.timeline.zoom + (ZOOM_MAXIMUM - ZOOM_MINIMUM) * 0.1, ZOOM_MINIMUM, ZOOM_MAXIMUM));
        },
        [ACTION_ZOOM_OUT](payload: any, rootState: any) {
            dispatch.timeline[REDUCER_SET_ZOOM](clamp(rootState.timeline.zoom - (ZOOM_MAXIMUM - ZOOM_MINIMUM) * 0.1, ZOOM_MINIMUM, ZOOM_MAXIMUM));
        },
        [ACTION_SOURCE_CHANGE](payload: AudioBuffer) {
            dispatch.timeline[REDUCER_SET_DURATION](payload.duration * 1000);
        },
        [ACTION_CLIP_REGION_CHANGE](payload: {start: number; end: number}) {
            dispatch.timeline[REDUCER_SET_CLIP_REGION](payload);
        }
    })
};

export default timelineModel;