export const ACTION_LOAD_FILE_FROM_LOCAL = 'ACTION_LOAD_FILE_FROM_LOCAL';
export const ACTION_LOAD_FILE_FROM_URL = 'ACTION_LOAD_FILE_FROM_URL';
export const ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE = 'ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE';
export const ACTION_LOAD_FILE_FROM_URL_COMPLETE = 'ACTION_LOAD_FILE_FROM_URL_COMPLETE';


export interface FileState{
    path: string;
    audioBuffer?: AudioBuffer;
    loading: boolean;
    tag: {
        author: string;
        title: string;
        cover: string;
    };
}