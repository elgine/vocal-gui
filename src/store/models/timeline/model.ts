import { RematchDispatch, ModelConfig } from '@rematch/core';
import {
    TimelineState,
    ACTION_SCALE_TIME,
    ACTION_SOURCE_CHANGE,
    REDUCER_SET_DURATION,
    REDUCER_SET_SCALE_TIME
} from './types';
import { TIME_UNITS } from '../../../constant';
import calcProperTimeUnits from './calcProperTimeUnits';

const initialState: TimelineState = {
    pixelsPerMSec: 0.01,
    duration: 0,
    scaleTime: 1,
    timeUnits: TIME_UNITS
};

const timelineModel: ModelConfig<TimelineState> = {
    state: initialState,
    reducers: {
        [REDUCER_SET_SCALE_TIME](state: TimelineState, payload: number) {
            state.scaleTime = payload;
            state.timeUnits = calcProperTimeUnits(TIME_UNITS[0] * state.scaleTime);
            return state;
        },
        [REDUCER_SET_DURATION](state: TimelineState, payload: number) {
            state.duration = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        [ACTION_SCALE_TIME](payload: number, rootState: any) {
            dispatch.timeline[REDUCER_SET_SCALE_TIME](payload);
        },
        [ACTION_SOURCE_CHANGE](payload: any, rootState: any) {
            dispatch.timeline[REDUCER_SET_DURATION](rootState.source.audioBuffer);
        }
    })
};

export default timelineModel;