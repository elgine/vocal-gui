import { RenderTask } from '../../../processor/renderer';

export const REDUCER_SET_RENDERING = 'REDUCER_SET_RENDERING';
export const REDUCER_ADD_RENDER_TASK = 'REDUCER_ADD_RENDER_TASK';

export const ACTION_ADD_RENDER_TASK = 'ACTION_ADD_RENDER_TASK';
export const ACTION_START_RENDERING = 'ACTION_START_RENDERING';
export const ACTION_CANCEL_RENDERING = 'ACTION_CANCEL_RENDERING';
export const ACTION_CANCEL_RENDERING_ALL = 'ACTION_CANCEL_RENDERING_ALL';
export const ACTION_SET_RENDERING_OPTIONS = 'ACTION_SET_RENDERING_OPTIONS';

export interface RendererState{
    rendering: boolean;
    tasks: Dictionary<RenderTask>;
}