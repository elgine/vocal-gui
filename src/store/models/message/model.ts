import { batch } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import {
    MessageState,
    REDUCER_SET_MESSAGE,
    REDUCER_RESET_MESSAGE_CONTENT,
    REDUCER_SET_SHOW,
    ACTION_SHOW_MESSAGE,
    ACTION_HIDE_MESSAGE
} from './type';
import { EMPTY_STRING } from '../../../constant';

const initialState: MessageState = {
    msg: EMPTY_STRING,
    msgType: 'INFO',
    showMsg: false,
    showConfirm: false,
    native: false
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_MESSAGE](state: MessageState, payload: Message) {
            state.msgType = payload.msgType;
            state.msg = payload.msg;
            state.native = payload.native || false;
            state.showConfirm = payload.showConfirm || false;
            state.confirmAction = payload.confirmAction;
            state.confirmLabel = payload.confirmLabel;
            state.confirmParams = payload.confirmParams;
            return state;
        },
        [REDUCER_SET_SHOW](state: MessageState, payload: boolean) {
            state.showMsg = payload;
            return state;
        },
        [REDUCER_RESET_MESSAGE_CONTENT](state: MessageState) {
            state.showConfirm = false;
            state.confirmAction = undefined;
            state.confirmLabel = undefined;
            state.confirmParams = undefined;
            state.native = false;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        [ACTION_SHOW_MESSAGE](payload: Message) {
            batch(() => {
                dispatch.message[REDUCER_SET_MESSAGE](payload);
                dispatch.message[REDUCER_SET_SHOW](true);
            });
        },
        [ACTION_HIDE_MESSAGE](payload: any) {
            batch(() => {
                dispatch.message[REDUCER_SET_SHOW](false);
                dispatch.message[REDUCER_RESET_MESSAGE_CONTENT]();
            });
        }
    })
};