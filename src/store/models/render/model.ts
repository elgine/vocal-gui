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
import { RootState } from '../..';
import uuid from 'uuid/v4';

const initialState: RendererState = {
    rendering: true,
    tasks: {}
};

const existsFreeRenderTask = (tasks: Dictionary<RenderTask>) => {
    return Object.values(tasks).filter((t) => t.state === 0).length > 0;
};

export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_TASKS_STATE](state: RendererState, payload: Dictionary<AnyOf<Omit<RenderTask, 'id'>>>) {
            for (let k in payload) {
                if (state.tasks[k]) {
                    state.tasks[k] = {
                        ...state.tasks[k],
                        ...payload[k]
                    };
                }
            }
            return state;
        },
        [REDUCER_REMOVE_RENDER_TASK](state: RendererState, payload: Dictionary<string>) {
            let newTasks = {};
            for (let k in state.tasks) {
                if (!payload[k]) {
                    newTasks[k] = state.tasks[k];
                }
            }
            state.tasks = newTasks;
            return state;
        },
        [REDUCER_ADD_RENDER_TASK](state: RendererState, payload: RenderTask) {
            state.tasks[payload.id] = payload;
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
            [ACTION_RENDER_SUCCESS]({ id }: {id: string; result: Uint8Array[]}, { present }: RootState) {
                batch(() => {
                    dispatch.render[REDUCER_SET_TASKS_STATE]({
                        [id]: { state: 1 },
                    });
                    if (existsFreeRenderTask(present.render.tasks)) {
                        dispatch.render[REDUCER_SET_RENDERING](false);
                    }
                });
            },
            [ACTION_RENDER](payload: ExportParams, { present }: RootState) {
                batch(() => {
                    const { editor } = present;
                    const newTask: RenderTask = {
                        id: uuid(),
                        title: editor.title,
                        level: 0,
                        state: 0,
                        taskCreatedTime: Date.now(),
                        effectType: editor.effect,
                        effectOptions: editor.effectOptions,
                        clipRegion: editor.clipRegion,
                        options: payload
                    };
                    dispatch.render[REDUCER_ADD_RENDER_TASK](newTask);
                    dispatch.render[ACTION_START_RENDERING]();
                });
            },
            [ACTION_START_RENDERING](payload: Dictionary<string> | undefined, { present }: RootState) {
                batch(() => {
                    let newPayload = {};
                    /* eslint-disable */
                    for (let k in payload) {
                        const task = present.render.tasks[k];
                        if(task && task.state === -2)
                            newPayload[k] = { state: 0 };
                    }
                    dispatch.render[REDUCER_SET_TASKS_STATE](newPayload);
                    dispatch.render[REDUCER_SET_RENDERING](true);
                });
            },
            [ACTION_CANCEL_RENDERING](payload: Dictionary<string>, { present }: RootState) {
                batch(() => {
                    dispatch.render[REDUCER_REMOVE_RENDER_TASK](payload);
                    if (existsFreeRenderTask(present.render.tasks)) {
                        dispatch.render[REDUCER_SET_RENDERING](false);
                    }
                });
            },
            [ACTION_CANCEL_RENDERING_ALL]() {
                batch(() => {
                    dispatch.render[REDUCER_CLEAR_TASKS]();
                    dispatch.render[REDUCER_SET_RENDERING](false);
                });
            },
            [ACTION_STOP_RENDERING](payload: Dictionary<string>, { present }: RootState) {
                batch(() => {
                    let newPayload = {};
                    /* eslint-disable */
                    for (let k in payload) {
                        const task = present.render.tasks[k];
                        if(task && task.state >= 0 && task.state < 1)
                            newPayload[k] = { state: -2 };
                    }
                    dispatch.render[REDUCER_SET_TASKS_STATE](newPayload);
                    if (existsFreeRenderTask(present.render.tasks)) {
                        dispatch.render[REDUCER_SET_RENDERING](false);
                    }
                });
            },
            [ACTION_STOP_RENDERING_ALL](payload: any, { present }: RootState) {
                batch(() => {
                    dispatch.render[REDUCER_SET_TASKS_STATE](Object.keys(present.render.tasks).reduce((map, id) => {
                        map[id] = { state: -2 };
                        return map;
                    }, {}));
                    dispatch.render[REDUCER_SET_RENDERING](false);
                });
            }
        };
    }
};