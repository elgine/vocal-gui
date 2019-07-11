import {
    RecorderState, ACTION_START_RECORDING, ACTION_STOP_RECORDING, ACTION_SAVE_RECORDING,
    ACTION_SAVE_RECORDING_SUCCESS, ACTION_CANCEL_SAVING_RECORDING
} from './types';

import { Model } from '@rematch/core';
import { getRecorder } from '../../processor';

const initialState: RecorderState = {
    recording: false,
    saving: false
};

export default {
    state: initialState,
    reducers: {
        [ACTION_START_RECORDING](state: RecorderState) {
            state.recording = true;
            return state;
        },
        [ACTION_STOP_RECORDING](state: RecorderState) {
            state.recording = false;
            return state;
        },
        [ACTION_SAVE_RECORDING](state: RecorderState) {
            state.saving = true;
            return state;
        },
        [ACTION_SAVE_RECORDING_SUCCESS](state: RecorderState) {
            state.saving = false;
            return state;
        },
        [ACTION_CANCEL_SAVING_RECORDING](state: RecorderState) {
            state.saving = false;
            return state;
        }
    },
    effects: {
        async [ACTION_START_RECORDING](payload: undefined, rootState: any) {
            const recorder = getRecorder();
            await recorder.init();
            recorder.start();
            this[ACTION_START_RECORDING](rootState.recorder);
        }
    }
};