import {
    ACTION_LOAD_FILE_FROM_LOCAL, SourceState,
    ACTION_CANCEL_LOAD_FILE, ACTION_LOAD_FILE_FROM_URL,
    ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE,
    ACTION_LOAD_FILE_FROM_URL_COMPLETE,
    ACTION_LOAD_FILE_FROM_LOCAL_FAILED,
    ACTION_LOAD_FILE_FROM_URL_FAILED
} from './types';
import { UNDEFINED_STRING } from '../../../constant';

const initialState: SourceState = {
    loading: false,
    filename: UNDEFINED_STRING
};

const reset = (state: SourceState) => {
    state.filename = UNDEFINED_STRING;
    state.loading = false;
    state.audioBuffer = undefined;
    return state;
};

export default {
    state: initialState,
    reducers: {
        [ACTION_CANCEL_LOAD_FILE](state: SourceState) {
            return reset(state);
        },
        [ACTION_LOAD_FILE_FROM_URL](state: SourceState, payload: string) {
            state.filename = payload.substring(payload.lastIndexOf('/'));
            state.loading = true;
            return state;
        },
        [ACTION_LOAD_FILE_FROM_LOCAL](state: SourceState, payload: File) {
            state.filename = payload.name;
            state.loading = true;
            return state;
        },
        [ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE](state: SourceState, payload: AudioBuffer) {
            state.audioBuffer = payload;
            state.loading = false;
            return state;
        },
        [ACTION_LOAD_FILE_FROM_URL_COMPLETE](state: SourceState, payload: AudioBuffer) {
            state.audioBuffer = payload;
            state.loading = false;
            return state;
        },
        [ACTION_LOAD_FILE_FROM_LOCAL_FAILED](state: SourceState, payload: Error) {
            return reset(state);
        },
        [ACTION_LOAD_FILE_FROM_URL_FAILED](state: SourceState, payload: Error) {
            return reset(state);
        }
    }
};