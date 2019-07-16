import { RematchDispatch } from '@rematch/core';
import {
    SourceState,
    REDUCER_SET_INFO,
    REDUCER_SET_LOADING,
    REDUCER_SET_BUFFER,
    ACTION_LOAD_SOURCE,
    ACTION_LOAD_FAILED,
    ACTION_LOAD_FROM_LOCAL,
    ACTION_LOAD_FROM_URL
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
        [ACTION_LOAD_SOURCE](payload: {type: SourceType; url?: string; file?: File}) {
            if (payload.type === 'LOCAL') {
                dispatch.source[ACTION_LOAD_FROM_LOCAL](payload.file);
            } else if (payload.type === 'URL') {
                dispatch.source[ACTION_LOAD_FROM_URL](payload.url);
            }
        },
        [ACTION_LOAD_FROM_URL](payload: string, rootState: any) {
            dispatch.source[REDUCER_SET_INFO]({
                title: payload.substring(payload.lastIndexOf('/'))
            });
            dispatch.source[REDUCER_SET_LOADING](true);
        },
        [ACTION_LOAD_FROM_LOCAL](payload: File, rootState: any) {
            dispatch.source[REDUCER_SET_INFO]({
                title: payload.name.substring(payload.name.lastIndexOf('/'))
            });
            dispatch.source[REDUCER_SET_LOADING](true);
        },
        [ACTION_LOAD_FAILED](payload: Error, rootState: any) {
            dispatch.source[REDUCER_SET_LOADING](false);
        }
    })
};