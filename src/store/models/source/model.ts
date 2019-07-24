import { RematchDispatch } from '@rematch/core';
import { batch } from 'react-redux';
import {
    SourceState,
    REDUCER_SET_TITLE,
    REDUCER_SET_LOADING,
    REDUCER_SET_BUFFER,
    ACTION_LOAD_SOURCE,
    ACTION_LOAD_FAILED,
    ACTION_LOAD_FROM_LOCAL,
    ACTION_LOAD_FROM_URL,
    ACTION_LOAD_SOURCE_SUCCESS,
    ACTION_LOAD_FROM_MIC,
    ACTION_CANCEL_LOAD_SORUCE
} from './types';
import { UNDEFINED_STRING } from '../../../constant';
import { ACTION_SOURCE_CHANGE } from '../timeline/types';
import { ACTION_SHOW_MESSAGE } from '../message/type';

const initialState: SourceState = {
    loading: false,
    title: UNDEFINED_STRING
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_TITLE](state: SourceState, payload: string) {
            state.title = payload;
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
        [ACTION_CANCEL_LOAD_SORUCE]() {
            dispatch.source[REDUCER_SET_LOADING](false);
        },
        [ACTION_LOAD_SOURCE](payload: {type: SourceType; value?: string | File | AudioBuffer}, rootState: any) {
            if (!payload.value) return;
            dispatch.source[`ACTION_LOAD_FROM_${payload.type}`](payload.value);
        },
        [ACTION_LOAD_SOURCE_SUCCESS]({ buffer, title }: {buffer: AudioBuffer; title: string}) {
            batch(() => {
                dispatch.source[REDUCER_SET_TITLE](title);
                dispatch.source[REDUCER_SET_BUFFER](buffer);
                dispatch.source[REDUCER_SET_LOADING](false);
                dispatch.player[ACTION_SOURCE_CHANGE](buffer);
                dispatch.timeline[ACTION_SOURCE_CHANGE](buffer);
            });
        },
        [ACTION_LOAD_FROM_MIC](payload: AudioBuffer, rootState: any) {
            batch(() => {
                dispatch.source[ACTION_LOAD_SOURCE_SUCCESS](payload);
                dispatch.source[REDUCER_SET_TITLE](`Record${Date.now()}`);
            });
        },
        [ACTION_LOAD_FROM_URL](payload: string, rootState: any) {
            dispatch.source[REDUCER_SET_LOADING](true);
        },
        [ACTION_LOAD_FROM_LOCAL](payload: File, rootState: any) {
            dispatch.source[REDUCER_SET_LOADING](true);
        },
        [ACTION_LOAD_FAILED](payload: Error, rootState: any) {
            batch(() => {
                dispatch.source[REDUCER_SET_LOADING](false);
                dispatch.message[ACTION_SHOW_MESSAGE]({
                    msg: payload.message,
                    msgType: 'ERROR'
                });
            });
        }
    })
};