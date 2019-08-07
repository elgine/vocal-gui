import {
    LocaleState,
    REDUCER_SET_LANG,
    ACTION_SWITCH_LANG
} from './types';

import { Lang } from '../../../lang';

const initialState: LocaleState = {
    lang: Lang.CN
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_LANG](state: LocaleState, payload: Lang) {
            state.lang = payload;
            return state;
        }
    },
    effects: {
        [ACTION_SWITCH_LANG](payload: Lang) {
            this[REDUCER_SET_LANG](payload);
        }
    }
};