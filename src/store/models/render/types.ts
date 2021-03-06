import { Action } from 'redux';
import { RenderTask } from '../../../services/renderer';

export const REDUCER_SET_TASKS_STATE = 'REDUCER_SET_TASKS_STATE';
export const REDUCER_SET_RENDERING = 'REDUCER_SET_RENDERING';
export const REDUCER_ADD_RENDER_TASK = 'REDUCER_ADD_RENDER_TASK';
export const REDUCER_REMOVE_RENDER_TASK = 'REDUCER_REMOVE_RENDER_TASK';
export const REDUCER_CLEAR_TASKS = 'REDUCER_CLEAR_TASKS';

export const ACTION_RENDER = 'ACTION_RENDER';
export const ACTION_RENDER_PROGRESS = 'ACTION_RENDER_PROGRESS';
export const ACTION_RENDER_SUCCESS = 'ACTION_RENDER_SUCCESS';
export const ACTION_RENDER_FAILED = 'ACTION_RENDER_FAILED';
export const ACTION_RESUME_RENDERING = 'ACTION_RESUME_RENDERING';
export const ACTION_STOP_RENDERING = 'ACTION_STOP_RENDERING';
export const ACTION_STOP_RENDERING_ALL = 'ACTION_STOP_RENDERING_ALL';
export const ACTION_CANCEL_RENDERING = 'ACTION_CANCEL_RENDERING';
export const ACTION_CANCEL_RENDERING_ALL = 'ACTION_CANCEL_RENDERING_ALL';
export const ACTION_SET_RENDERING_OPTIONS = 'ACTION_SET_RENDERING_OPTIONS';

export const ACTION_ENCODE_INIT = 'ACTION_ENCODE_INIT';
export const ACTION_ENCODE = 'ACTION_ENCODE';
export const ACTION_ENCODE_CLOSE = 'ACTION_ENCODE_CLOSE';
export const ACTION_ENCODE_ERROR = 'ACTION_ENCODE_ERROR';
export const ACTION_ENCODE_SUCCESS = 'ACTION_ENCODE_SUCCESS';

export interface RenderAction extends Action{
    type: typeof ACTION_RENDER;
    payload: RenderTask;
}

export interface CancelRenderingAction extends Action{
    type: typeof ACTION_CANCEL_RENDERING;
    payload: string;
}

export interface RendererState{
    rendering: boolean;
    tasks: Dictionary<RenderTask>;
}