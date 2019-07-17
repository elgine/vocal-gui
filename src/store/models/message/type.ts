export const REDUCER_SET_MESSAGE = 'REDUCER_SET_MESSAGE';
export const REDUCER_SET_SHOW = 'REDUCER_SET_SHOW';

export const ACTION_SHOW_MESSAGE = 'ACTION_SHOW_MESSAGE';
export const ACTION_HIDE_MESSAGE = 'ACTION_HIDE_MESSAGE';

export interface MessageState{
    msg: string;
    msgType: MessageType;
    showMsg: boolean;
}