import { Action } from 'redux';

export const REDUCER_SET_TITLE = 'REDUCER_SET_TITLE';
export const REDUCER_SET_LOADING = 'REDUCER_SET_LOADING';
export const REDUCER_SET_BUFFER = 'REDUCER_SET_BUFFER';

export const ACTION_LOAD_SOURCE = 'ACTION_LOAD_SOURCE';
export const ACTION_LOAD_SOURCE_SUCCESS = 'ACTION_LOAD_SOURCE_SUCCESS';
export const ACTION_LOAD_FAILED = 'ACTION_LOAD_FAILED';
export const ACTION_LOAD_FROM_LOCAL = 'ACTION_LOAD_FROM_LOCAL';
export const ACTION_LOAD_FROM_URL = 'ACTION_LOAD_FROM_URL';
export const ACTION_CANCEL_LOAD_SORUCE = 'ACTION_CANCEL_LOAD_SORUCE';
export const ACTION_LOAD_FROM_MIC = 'ACTION_LOAD_FROM_MIC';

export interface LoadFileFromURLAction extends Action{
    payload: string;
}

export interface LoadFileFromLocalAction extends Action{
    payload: File;
}

export interface SourceState{
    title: string;
    audioBuffer?: AudioBuffer;
    loading: boolean;
}