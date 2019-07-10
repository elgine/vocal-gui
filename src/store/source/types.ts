import { Action } from 'redux';

export const ACTION_LOAD_FILE_FROM_LOCAL = 'ACTION_LOAD_FILE_FROM_LOCAL';
export const ACTION_LOAD_FILE_FROM_URL = 'ACTION_LOAD_FILE_FROM_URL';
export const ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE = 'ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE';
export const ACTION_LOAD_FILE_FROM_URL_COMPLETE = 'ACTION_LOAD_FILE_FROM_URL_COMPLETE';
export const ACTION_CANCEL_LOAD_FILE = 'ACTION_CANCEL_LOAD_FILE';

export const ACTION_LOAD_FILE_FROM_URL_FAILED = 'ACTION_LOAD_FILE_FROM_URL_FAILED';
export const ACTION_LOAD_FILE_FROM_LOCAL_FAILED = 'ACTION_LOAD_FILE_FROM_LOCAL_FAILED';

export interface LoadFileFromURLAction extends Action{
    payload: string;
}

export interface LoadFileFromLocalAction extends Action{
    payload: File;
}

export interface SourceState{
    filename: string;
    audioBuffer?: AudioBuffer;
    loading: boolean;
}