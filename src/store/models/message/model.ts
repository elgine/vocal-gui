import { RematchDispatch } from '@rematch/core';
import { MessageState, REDUCER_SET_MESSAGE, ACTION_SHOW_MESSAGE, ACTION_HIDE_MESSAGE, REDUCER_SET_SHOW } from './type';
import { EMPTY_STRING } from '../../../constant';

const initialState: MessageState = {
    msg: EMPTY_STRING,
    msgType: 'INFO',
    showMsg: false,
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_MESSAGE](state: MessageState, payload: Message) {
            state.msgType = payload.msgType;
            state.msg = payload.msg;
            return state;
        },
        [REDUCER_SET_SHOW](state: MessageState, payload: boolean) {
            state.showMsg = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        [ACTION_SHOW_MESSAGE](payload: Message) {
            dispatch.message[REDUCER_SET_MESSAGE](payload);
            dispatch.message[REDUCER_SET_SHOW](true);
        },
        [ACTION_HIDE_MESSAGE](payload: any, rootState: any) {
            dispatch.message[REDUCER_SET_SHOW](false);
        }
    })
};