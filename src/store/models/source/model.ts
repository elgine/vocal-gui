import { RematchDispatch } from '@rematch/core';
import {
    SourceState,
    ACTION_LOAD_FILE_FROM_LOCAL,
    ACTION_LOAD_FILE_FROM_URL,
    ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE,
    ACTION_LOAD_FILE_FROM_URL_COMPLETE,
    ACTION_LOAD_FILE_FAILED,
    REDUCER_SET_INFO,
    REDUCER_SET_LOADING,
    REDUCER_SET_BUFFER
} from './types';
import { UNDEFINED_STRING } from '../../../constant';

const initialState: SourceState = {
    loading: false,
    info: {
        title: UNDEFINED_STRING
    }
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_INFO](state: SourceState, payload: any) {
            state.info = payload;
            return state;
        },
        [REDUCER_SET_LOADING](state: SourceState, payload: boolean) {
            state.loading = payload;
            return state;
        },
        [REDUCER_SET_BUFFER](state: SourceState, payload: AudioBuffer) {
            state.audioBuffer = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        [ACTION_LOAD_FILE_FROM_URL](payload: string, rootState: any) {
            dispatch.source[REDUCER_SET_INFO]({
                title: payload.substring(payload.lastIndexOf('/'))
            });
            dispatch.source[REDUCER_SET_LOADING](true);
        },
        [ACTION_LOAD_FILE_FROM_LOCAL](payload: File, rootState: any) {
            dispatch.source[REDUCER_SET_INFO]({
                title: payload.name.substring(payload.name.lastIndexOf('/'))
            });
            dispatch.source[REDUCER_SET_LOADING](true);
        },
        [ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE](payload: AudioBuffer, rootState: any) {
            dispatch.source[REDUCER_SET_BUFFER](payload);
            dispatch.source[REDUCER_SET_LOADING](false);
        },
        [ACTION_LOAD_FILE_FROM_URL_COMPLETE](payload: AudioBuffer, rootState: any) {
            dispatch.source[REDUCER_SET_BUFFER](payload);
            dispatch.source[REDUCER_SET_LOADING](false);
        },
        [ACTION_LOAD_FILE_FAILED](payload: Error, rootState: any) {
            dispatch.source[REDUCER_SET_LOADING](false);
        }
    })
};