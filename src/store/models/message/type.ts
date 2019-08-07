export const REDUCER_SET_MESSAGE = 'REDUCER_SET_MESSAGE';
export const REDUCER_SET_SHOW = 'REDUCER_SET_SHOW';
export const REDUCER_RESET_MESSAGE_CONTENT = 'REDUCER_RESET_MESSAGE_CONTENT';

export const ACTION_SHOW_MESSAGE = 'ACTION_SHOW_MESSAGE';
export const ACTION_HIDE_MESSAGE = 'ACTION_HIDE_MESSAGE';

export interface MessageState{
    msg: string;
    msgType: MessageType;
    showMsg: boolean;
    showConfirm: boolean;
    confirmLabel?: string;
    confirmAction?: string;
    confirmParams?: any;
    native: boolean;
}