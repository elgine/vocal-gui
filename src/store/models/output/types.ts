export const REDUCER_SET_TASKS_STATE = 'REDUCER_SET_TASKS_STATE';
export const REDUCER_SET_OUTPUTING = 'REDUCER_SET_OUTPUTING';
export const REDUCER_ADD_OUTPUT_TASK = 'REDUCER_ADD_OUTPUT_TASK';
export const REDUCER_REMOVE_OUTPUT_TASK = 'REDUCER_REMOVE_OUTPUT_TASK';

export const ACTION_OUTPUT = 'ACTION_OUTPUT';
export const ACTION_OUTPUT_SUCCESS = 'ACTION_OUTPUT_SUCCESS';
export const ACTION_OUTPUT_FAILED = 'ACTION_OUTPUT_FAILED';
export const ACTION_STOP_OUTPUT = 'ACTION_STOP_OUTPUT';
export const ACTION_RESUME_OUTPUT = 'ACTION_RESUME_OUTPUT';
export const ACTION_CANCEL_OUTPUT = 'ACTION_CANCEL_OUTPUT';
export const ACTION_STOP_OUTPUT_ALL = 'ACTION_STOP_OUTPUT_ALL';
export const ACTION_CANCEL_OUTPUT_ALL = 'ACTION_CANCEL_OUTPUT_ALL';
export const ACTION_OUTPUT_PROGRESS = 'ACTION_OUTPUT_PROGRESS';

export type OutputTaskLevelNormal = 0;
export type OutputTaskLevelHigh = 1;
export type OutputTaskLevel = OutputTaskLevelNormal | OutputTaskLevelHigh;

export type OutputTaskStateWaiting = 0;
export type OutputTaskStateRenderComplete = 1;
export type OutputTaskStateEncodeComplete = 2;
export type OutputTaskStateDownloadComplete = 3;
export type OutputTaskStateStopped = -2;
export type OutputTaskStateFailed = -1;
export type OutputTaskState = OutputTaskStateWaiting |
OutputTaskStateRenderComplete |
OutputTaskStateEncodeComplete |
OutputTaskStateDownloadComplete |
OutputTaskStateStopped |
OutputTaskStateFailed;

export enum OutputTaskStage{
    FREE,
    RENDERING,
    ENCODING,
    DOWNLOADING
}

export interface OutputTask{
    id: string;
    title: string;
    source?: AudioBuffer;
    level: number;
    state: number;
    taskCreatedTime: number;
    effectType: number;
    effectOptions: any;
    clipRegion: number[];
    exportParams: OutputParams;
}

export interface OutputState{
    outputing: boolean;
    tasks: Dictionary<OutputTask>;
}