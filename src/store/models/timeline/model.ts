import { RematchDispatch, ModelConfig } from '@rematch/core';
import { clamp } from 'lodash';
import { batch } from 'react-redux';
import {
    TimelineState,
    ACTION_ZOOM,
    ACTION_CLIP_REGION_CHANGE,
    ACTION_SOURCE_CHANGE,
    REDUCER_SET_DURATION,
    REDUCER_SET_ZOOM,
    REDUCER_SET_CLIP_REGION,
    ACTION_ZOOM_IN,
    ACTION_ZOOM_OUT,
    REDUCER_SET_CURRENT_TIME,
    ACTION_SEEK,
    ACTION_SKIP_PREVIOUS,
    ACTION_SKIP_NEXT
} from './types';
import calcMaxFactor from '../../../utils/calcMaxFactor';
import { TIME_UNITS, PIXELS_PER_TIME_UNIT, ZOOM_MAXIMUM, ZOOM_MINIMUM } from '../../../constant';
import { getPlayer } from '../../../processor';

const initialState: TimelineState = {
    pixelsPerMSec: 0.01,
    duration: 0,
    zoom: 1,
    zoomUnit: {
        in: 2,
        out: 0.5
    },
    baseTimeUnit: TIME_UNITS[0],
    timeUnits: TIME_UNITS,
    currentTime: 0,
    clipRegion: [0, 0]
};

const roundTimeUnit = (timeUnit: number) => {
    const unitStr = String(timeUnit);
    const len = unitStr.length;
    const den = Math.pow(10, len - 1);
    return Math.ceil(timeUnit / den) * den;
};

const calcProperTimeUnit = (duration: number) => {
    return roundTimeUnit(~~(duration * 0.05));
};

const calcProperTimeUnits = (timeUnit: number) => {
    return [
        timeUnit,
        timeUnit * 0.5,
        timeUnit * 0.25
    ];
};

const updateTimeUnits = (state: TimelineState) => {
    let zoom = 1;
    if (state.zoom > 1) {
        zoom = (state.zoom - 1) * state.zoomUnit.in + 1;
    } else if (state.zoom < 1) {
        zoom = 1 / (((1 - state.zoom) * state.zoomUnit.out) + 1);
    }
    let ideaTimeUnit = Math.ceil(state.baseTimeUnit * (zoom || 1));
    state.timeUnits = calcProperTimeUnits(ideaTimeUnit);
    state.pixelsPerMSec = PIXELS_PER_TIME_UNIT / state.timeUnits[0];
};

const timelineModel: ModelConfig<TimelineState> = {
    state: initialState,
    reducers: {
        [REDUCER_SET_ZOOM](state: TimelineState, payload: number) {
            state.zoom = payload;
            updateTimeUnits(state);
            return state;
        },
        [REDUCER_SET_CURRENT_TIME](state: TimelineState, payload: number) {
            state.currentTime = clamp(payload, state.clipRegion[0], state.clipRegion[1]);
            return state;
        },
        [REDUCER_SET_DURATION](state: TimelineState, payload: number) {
            state.duration = payload;
            state.baseTimeUnit = calcProperTimeUnit(state.duration);
            state.zoomUnit.out = Math.max(2, Math.ceil(1000 / state.baseTimeUnit));
            state.zoomUnit.in = Math.max(2, Math.ceil((state.duration * 0.01) / state.baseTimeUnit));
            console.log(state.zoomUnit.out, state.zoomUnit.in);
            updateTimeUnits(state);
            return state;
        },
        [REDUCER_SET_CLIP_REGION](state: TimelineState, payload: number[]) {
            state.clipRegion = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        [ACTION_ZOOM](payload: number) {
            dispatch.timeline[REDUCER_SET_ZOOM](payload);
        },
        [ACTION_ZOOM_IN](payload: any, rootState: any) {
            dispatch.timeline[REDUCER_SET_ZOOM](clamp(rootState.timeline.zoom - (ZOOM_MAXIMUM - ZOOM_MINIMUM) * 0.1, ZOOM_MINIMUM, ZOOM_MAXIMUM));
        },
        [ACTION_ZOOM_OUT](payload: any, rootState: any) {
            dispatch.timeline[REDUCER_SET_ZOOM](clamp(rootState.timeline.zoom + (ZOOM_MAXIMUM - ZOOM_MINIMUM) * 0.1, ZOOM_MINIMUM, ZOOM_MAXIMUM));
        },
        [ACTION_SOURCE_CHANGE](payload: AudioBuffer) {
            batch(() => {
                dispatch.timeline[REDUCER_SET_DURATION](payload.duration * 1000);
                dispatch.timeline[ACTION_CLIP_REGION_CHANGE]([
                    0,
                    payload.duration * 1000
                ]);
            });
        },
        [ACTION_SEEK](payload: number) {
            dispatch.timeline[REDUCER_SET_CURRENT_TIME](payload);
        },
        [ACTION_SKIP_PREVIOUS](payload: any, rootState: any) {
            dispatch.timeline[REDUCER_SET_CURRENT_TIME](rootState.timeline.clipRegion[0]);
        },
        [ACTION_SKIP_NEXT](payload: any, rootState: any) {
            dispatch.timeline[REDUCER_SET_CURRENT_TIME](rootState.timeline.clipRegion[1]);
        },
        [ACTION_CLIP_REGION_CHANGE](payload: number[], rootState: any) {
            const timeline = rootState.timeline;
            if (payload[1] < payload[0]) {
                let temp = payload[0];
                payload[0] = payload[1];
                payload[1] = temp;
            }
            payload[0] = clamp(payload[0], 0, timeline.duration);
            payload[1] = clamp(payload[1], 0, timeline.duration);
            const player = getPlayer();
            player.setRegion(payload);
            dispatch.timeline[REDUCER_SET_CLIP_REGION](payload);
        }
    })
};

export default timelineModel;