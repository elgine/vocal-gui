import { ACTION_SCALE_TIME, TimelineState } from './types';
import produce from 'immer';
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
            return produce(state, draft => {
                draft.scaleTime = payload;
                draft.timeUnits = calcProperTimeUnits(TIME_UNITS[0] * draft.scaleTime);
            });
        }
    }
};