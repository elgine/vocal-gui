import { RematchDispatch, Model, ExtractRematchStateFromModels } from '@rematch/core';
import { batch } from 'react-redux';
import {
    ACTION_RENDER, RendererState,
    ACTION_CANCEL_RENDERING, REDUCER_ADD_RENDER_TASK, REDUCER_SET_RENDERING,
    ACTION_START_RENDERING, ACTION_CANCEL_RENDERING_ALL
} from './types';
import { RenderTask, RenderTaskState } from '../../../processor/renderer';
import { getRenderer } from '../../../processor';

type RendererDispatch = RematchDispatch<{renderer: Model<RendererState>}>;

const initialState: RendererState = {
    rendering: false,
    tasks: []
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_ADD_RENDER_TASK](state: RendererState, payload: RenderTask) {
            state.tasks.push({
                taskCreatedTime: Date.now(),
                ...payload
            });
        },
        [REDUCER_SET_RENDERING](state: RendererState, payload: boolean) {
            state.rendering = payload;
        }
    },
    effects: (dispatch: RendererDispatch) => {
        const renderer = getRenderer();
        return {
            [ACTION_RENDER](payload: RenderTask) {
                batch(() => {
                    dispatch.renderer[REDUCER_ADD_RENDER_TASK](payload);
                    dispatch.renderer[ACTION_START_RENDERING]();
                });
            },
            [ACTION_START_RENDERING](payload: string | undefined, rootState: ExtractRematchStateFromModels<{renderer: Model<RendererState>}>) {
                dispatch.renderer[REDUCER_SET_RENDERING](true);
            },
            [ACTION_CANCEL_RENDERING](payload: string, rootState: {renderer: RendererState}) {
                renderer.cancel(payload);
                if (rootState.renderer.tasks.filter((t) => t.state === RenderTaskState.FREE).length <= 0) {
                    dispatch.renderer[REDUCER_SET_RENDERING](false);
                }
            },
            [ACTION_CANCEL_RENDERING_ALL]() {
                dispatch.renderer[REDUCER_SET_RENDERING](false);
            }
        };
    }
};