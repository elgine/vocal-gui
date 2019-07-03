import { ACTION_LOAD_FILE_FROM_LOCAL, FileState, ACTION_LOAD_FILE_FROM_URL, ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE, ACTION_LOAD_FILE_FROM_URL_COMPLETE } from './types';
import { UNDEFINED_STRING } from '../../constant';
import produce from 'immer';

const initialState: FileState = {
    path: UNDEFINED_STRING,
    loading: false,
    tag: {
        author: UNDEFINED_STRING,
        title: UNDEFINED_STRING,
        cover: ''
    }
};

export default {
    state: initialState,
    reducers: {
        [ACTION_LOAD_FILE_FROM_LOCAL](state: FileState, payload: string) {
            return produce(state, (draft) => {
                draft.path = payload;
                draft.loading = true;
            });
        },
        [ACTION_LOAD_FILE_FROM_URL](state: FileState, payload: string) {},
        [ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE](state: FileState, payload: AudioBuffer) {
            return produce(state, (draft) => {
                draft.audioBuffer = payload;
                draft.loading = false;
            });
        },
        [ACTION_LOAD_FILE_FROM_URL_COMPLETE](state: FileState, payload: AudioBuffer) {
            return produce(state, (draft) => {
                draft.audioBuffer = payload;
                draft.loading = false;
            });
        }
    }
};