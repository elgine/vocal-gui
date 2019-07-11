export const ACTION_START_RECORDING = 'ACTION_START_RECORDING';
export const ACTION_STOP_RECORDING = 'ACTION_STOP_RECORDING';
export const ACTION_SAVE_RECORDING = 'ACTION_SAVE_RECORDING';
export const ACTION_SAVE_RECORDING_SUCCESS = 'ACTION_SAVE_RECORDING_SUCCESS';
export const ACTION_CANCEL_SAVING_RECORDING = 'ACTION_CANCEL_SAVING_RECORDING';

export interface RecorderState{
    recording: boolean;
    saving: boolean;
}