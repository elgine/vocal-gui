import { ACTION_SCALE_TIME, TimelineState, ACTION_SET_DURATION } from './types';
import { TIME_UNITS } from '../../constant';
import calcProperTimeUnits from './calcProperTimeUnits';

const initialState: TimelineState = {
    pixelsPerMSec: 0.5,
    duration: 0,
    scaleTime: 1,
    timeUnits: TIME_UNITS
};

export default {
    state: initialState,
    reducers: {
        [ACTION_SCALE_TIME](state: TimelineState, payload: number) {
            if (state.scaleTime === payload) return;
            state.scaleTime = payload;
            state.timeUnits = calcProperTimeUnits(TIME_UNITS[0] * state.scaleTime);
            return state;
        },
        [ACTION_SET_DURATION](state: TimelineState, payload: number) {}
    }
};