import { RematchDispatch, Model, ExtractRematchStateFromModels } from '@rematch/core';
import {
    ACTION_ADD_RENDER_TASK, RendererState,
    ACTION_CANCEL_RENDERING, REDUCER_ADD_RENDER_TASK, REDUCER_SET_RENDERING,
    ACTION_START_RENDERING, ACTION_CANCEL_RENDERING_ALL
} from './types';
import { RenderTask, RenderTaskState } from '../../../processor/renderer';
import { getRenderer } from '../../../processor';

type RendererDispatch = RematchDispatch<{renderer: Model<RendererState>}>;

const initialState: RendererState = {
    rendering: false,
    tasks: {}
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_ADD_RENDER_TASK](state: RendererState, payload: RenderTask) {
            state.tasks[payload.source] = {
                taskCreatedTime: Date.now(),
                ...payload
            };
        },
        [REDUCER_SET_RENDERING](state: RendererState, payload: boolean) {
            state.rendering = payload;
        }
    },
    effects: (dispatch: RendererDispatch) => ({
        [ACTION_ADD_RENDER_TASK](payload: RenderTask) {
            dispatch.renderer[REDUCER_ADD_RENDER_TASK](payload);
        },
        [ACTION_START_RENDERING](payload: string | undefined, rootState: ExtractRematchStateFromModels<{renderer: Model<RendererState>}>) {
            const renderer = getRenderer();
            renderer.start(payload);
            dispatch.renderer[REDUCER_SET_RENDERING](true);
        },
        [ACTION_CANCEL_RENDERING](payload: string, rootState: {renderer: RendererState}) {
            const renderer = getRenderer();
            renderer.cancel(payload);
            if (Object.values(rootState.renderer.tasks).filter((t) => t.state === RenderTaskState.FREE).length <= 0) {
                dispatch.renderer[REDUCER_SET_RENDERING](false);
            }
        },
        [ACTION_CANCEL_RENDERING_ALL]() {
            dispatch.renderer[REDUCER_SET_RENDERING](false);
        }
    })
};