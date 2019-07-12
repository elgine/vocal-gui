import { RematchDispatch, Model, ModelEffects } from '@rematch/core';
import {
    RecorderState, ACTION_START_RECORDING, ACTION_STOP_RECORDING, ACTION_SAVE_RECORDING,
    ACTION_SAVE_RECORDING_SUCCESS, REDUCER_SET_RECORDING, REDUCER_SET_SAVING
} from './types';
import { getRecorder } from '../../../processor';
    
const initialState: RecorderState = {
    recording: false,
    saving: false
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_RECORDING](state: RecorderState, payload: boolean) {
            state.recording = payload;
            return state;
        },
        [REDUCER_SET_SAVING](state: RecorderState, payload: boolean) {
            state.saving = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        async [ACTION_START_RECORDING](payload: any, rootState: any) {
            const recorder = getRecorder();
            await recorder.init();
            recorder.start();
            dispatch.recorder[REDUCER_SET_RECORDING](true);
        },
        [ACTION_STOP_RECORDING](payload: any, rootState: any) {
            dispatch.recorder[REDUCER_SET_RECORDING](false);
        },
        [ACTION_SAVE_RECORDING](payload: any, rootState: any) {
            dispatch.recorder[REDUCER_SET_SAVING](true);
        },
        [ACTION_SAVE_RECORDING_SUCCESS](payload: string, rootState: any) {
            dispatch.recorder[REDUCER_SET_SAVING](false);
        }
    })
};