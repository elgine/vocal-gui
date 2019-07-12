import { Action } from 'redux';

export const REDUCER_SET_INFO = 'REDUCER_SET_INFO';
export const REDUCER_SET_LOADING = 'REDUCER_SET_LOADING';
export const REDUCER_SET_BUFFER = 'REDUCER_SET_BUFFER';

export const ACTION_LOAD_FILE_FROM_LOCAL = 'ACTION_LOAD_FILE_FROM_LOCAL';
export const ACTION_LOAD_FILE_FROM_URL = 'ACTION_LOAD_FILE_FROM_URL';
export const ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE = 'ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE';
export const ACTION_LOAD_FILE_FROM_URL_COMPLETE = 'ACTION_LOAD_FILE_FROM_URL_COMPLETE';
export const ACTION_CANCEL_LOAD_FILE = 'ACTION_CANCEL_LOAD_FILE';
export const ACTION_LOAD_FILE_FAILED = 'ACTION_LOAD_FILE_FAILED';

export interface LoadFileFromURLAction extends Action{
    payload: string;
}

export interface LoadFileFromLocalAction extends Action{
    payload: File;
}

export interface SourceState{
    info: {
        title: string;
    };
    audioBuffer?: AudioBuffer;
    loading: boolean;
}