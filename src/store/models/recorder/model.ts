import { RematchDispatch } from '@rematch/core';
import {
    RecorderState, RecorderStateMachine,
    REDUCER_SET_STATE,
    ACTION_START_RECORDING,
    ACTION_STOP_RECORDING,
    ACTION_SAVE_RECORDING,
    ACTION_INIT_RECORDING,
    ACTION_DISCARD_RECORDING
} from './types';
import { getRecorder } from '../../../processor';
import { ACTION_SHOW_MESSAGE } from '../message/type';

const initialState: RecorderState = {
    state: RecorderStateMachine.UNINITED
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_STATE](state: RecorderState, payload: RecorderStateMachine) {
            state.state = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        async [ACTION_INIT_RECORDING](payload: number, rootState: any) {
            const recorder = getRecorder();
            await recorder.init(payload);
            dispatch.recorder[REDUCER_SET_STATE](RecorderStateMachine.FREE);
        },
        async [ACTION_START_RECORDING](payload: any, rootState: any) {
            if (rootState.recorder.state === RecorderStateMachine.UNINITED) {
                dispatch.message[ACTION_SHOW_MESSAGE]({
                    msg: 'Recorder is not inited, please init recorder first',
                    msgType: 'ERROR'
                });
                return;
            }
            const recorder = getRecorder();
            recorder.start();
            dispatch.recorder[REDUCER_SET_STATE](RecorderStateMachine.RECORDING);
        },
        [ACTION_STOP_RECORDING](payload: any, rootState: any) {
            const recorder = getRecorder();
            recorder.stop();
            dispatch.recorder[REDUCER_SET_STATE](RecorderStateMachine.FREE);
        },
        [ACTION_DISCARD_RECORDING](payload: any, rootState: any) {
            const recorder = getRecorder();
            recorder.stop();
            recorder.clear();
            dispatch.recorder[REDUCER_SET_STATE](RecorderStateMachine.FREE);
        },
        async [ACTION_SAVE_RECORDING](payload: any, rootState: any) {
            const recorder = getRecorder();
            recorder.stop();
            dispatch.recorder[REDUCER_SET_STATE](RecorderStateMachine.SAVING);
            await recorder.save();
            recorder.clear();
            dispatch.recorder[REDUCER_SET_STATE](RecorderStateMachine.COMPLETE);
        }
    })
};