import { batch } from 'react-redux';
import {
    RendererState,
    REDUCER_SET_TASKS_STATE,
    REDUCER_ADD_RENDER_TASK,
    REDUCER_SET_RENDERING,
    REDUCER_REMOVE_RENDER_TASK,
    REDUCER_CLEAR_TASKS,
    ACTION_CANCEL_RENDERING,
    ACTION_RENDER,
    ACTION_START_RENDERING,
    ACTION_CANCEL_RENDERING_ALL,
    ACTION_RENDER_SUCCESS,
    ACTION_STOP_RENDERING,
    ACTION_STOP_RENDERING_ALL
} from './types';
import { RenderTask, RenderTaskState } from '../../../processor/renderer';

const initialState: RendererState = {
    rendering: false,
    tasks: {}
};

const existsFreeRenderTask = (tasks: Dictionary<RenderTask>) => {
    return Object.values(tasks).filter((t) => t.state === RenderTaskState.FREE).length > 0;
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_TASKS_STATE](state: RendererState, payload: Dictionary<AnyOf<Omit<RenderTask, 'id'>>>) {
            for (let k in payload) {
                if (state.tasks[k]) {
                    state.tasks[k] = {
                        ...payload[k],
                        ...state.tasks[k]
                    };
                }
            }
            return state;
        },
        [REDUCER_REMOVE_RENDER_TASK](state: RendererState, payload: string) {
            if (state.tasks[payload]) {
                Reflect.deleteProperty(state.tasks, payload);
            }
            return state;
        },
        [REDUCER_ADD_RENDER_TASK](state: RendererState, payload: RenderTask) {
            state.tasks[payload.id] = {
                taskCreatedTime: Date.now(),
                ...payload
            };
            return state;
        },
        [REDUCER_SET_RENDERING](state: RendererState, payload: boolean) {
            state.rendering = payload;
            return state;
        },
        [REDUCER_CLEAR_TASKS](state: RendererState) {
            state.tasks = {};
            return state;
        }
    },
    effects: (dispatch: any) => {
        return {
            [ACTION_RENDER_SUCCESS]({ id }: {id: string; result: Uint8Array[]}, rootState: any) {
                batch(() => {
                    dispatch.renderer[REDUCER_SET_TASKS_STATE]({
                        [id]: { state: RenderTaskState.COMPLETE }
                    });
                    if (existsFreeRenderTask(rootState.render.tasks)) {
                        dispatch.renderer[REDUCER_SET_RENDERING](false);
                    }
                });
            },
            [ACTION_RENDER](payload: RenderTask) {
                batch(() => {
                    dispatch.renderer[REDUCER_ADD_RENDER_TASK](payload);
                    dispatch.renderer[ACTION_START_RENDERING]();
                });
            },
            [ACTION_START_RENDERING](payload: string | undefined, rootState: any) {
                dispatch.renderer[REDUCER_SET_RENDERING](true);
            },
            [ACTION_CANCEL_RENDERING](payload: string, rootState: any) {
                batch(() => {
                    dispatch.renderer[REDUCER_REMOVE_RENDER_TASK](payload);
                    if (existsFreeRenderTask(rootState.render.tasks)) {
                        dispatch.renderer[REDUCER_SET_RENDERING](false);
                    }
                });
            },
            [ACTION_CANCEL_RENDERING_ALL]() {
                batch(() => {
                    dispatch.renderer[REDUCER_CLEAR_TASKS]();
                    dispatch.renderer[REDUCER_SET_RENDERING](false);
                });
            },
            [ACTION_STOP_RENDERING](payload: string, rootState: any) {
                batch(() => {
                    dispatch.renderer[REDUCER_SET_TASKS_STATE]({
                        [payload]: { state: RenderTaskState.STOPPED }
                    });
                    if (existsFreeRenderTask(rootState.render.tasks)) {
                        dispatch.renderer[REDUCER_SET_RENDERING](false);
                    }
                });
            },
            [ACTION_STOP_RENDERING_ALL](payload: any, rootState: any) {
                batch(() => {
                    dispatch.renderer[REDUCER_SET_TASKS_STATE](Object.keys(rootState.render.tasks).reduce((map, id) => {
                        map[id] = { state: RenderTaskState.STOPPED };
                        return map;
                    }, {}));
                    dispatch.renderer[REDUCER_SET_RENDERING](false);
                });
            }
        };
    }
};