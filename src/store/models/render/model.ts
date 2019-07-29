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
import { RenderTask, RenderTaskState, RenderTaskLevel } from '../../../processor/renderer';
import { RootState } from '../..';
import { EffectType } from '../../../processor/effectType';
import uuid from 'uuid/v4';

const tasksExample: Dictionary<RenderTask> = {
    '0': {
        state: RenderTaskState.FAILED,
        id: '0',
        title: 'asdfawdsafsda',
        effectType: EffectType.NONE,
        effectOptions: {},
        segments: [],
        level: RenderTaskLevel.NORMAL,
        taskCreatedTime: Date.now(),
        options: {
            bitRate: 128,
            format: 'MP3'
        }
    },
    '1': {
        id: '1',
        state: RenderTaskState.STOPPED,
        title: 'asdfawdsafsda',
        effectType: EffectType.NONE,
        effectOptions: {},
        segments: [],
        level: RenderTaskLevel.NORMAL,
        taskCreatedTime: Date.now(),
        options: {
            bitRate: 128,
            format: 'MP3'
        }
    },
    '2': {
        id: '2',
        state: 0.3,
        title: 'asdfawdsafsda',
        effectType: EffectType.NONE,
        effectOptions: {},
        segments: [],
        level: RenderTaskLevel.NORMAL,
        taskCreatedTime: Date.now(),
        options: {
            bitRate: 128,
            format: 'MP3'
        }
    },
    '3': {
        id: '3',
        state: RenderTaskState.WAITING,
        title: 'asdfawdsafsda',
        effectType: EffectType.NONE,
        effectOptions: {},
        segments: [],
        level: RenderTaskLevel.NORMAL,
        taskCreatedTime: Date.now(),
        options: {
            bitRate: 128,
            format: 'MP3'
        }
    },
    '4': {
        id: '4',
        state: RenderTaskState.WAITING,
        title: 'asdfawdsafsda',
        effectType: EffectType.NONE,
        effectOptions: {},
        segments: [],
        level: RenderTaskLevel.NORMAL,
        taskCreatedTime: Date.now(),
        options: {
            bitRate: 128,
            format: 'MP3'
        }
    },
    '5': {
        id: '5',
        state: RenderTaskState.WAITING,
        title: 'asdfawdsafsda',
        effectType: EffectType.NONE,
        effectOptions: {},
        segments: [],
        level: RenderTaskLevel.NORMAL,
        taskCreatedTime: Date.now(),
        options: {
            bitRate: 128,
            format: 'MP3'
        }
    },
    '6': {
        id: '6',
        state: RenderTaskState.WAITING,
        title: 'asdfawdsafsda',
        effectType: EffectType.NONE,
        effectOptions: {},
        segments: [],
        level: RenderTaskLevel.NORMAL,
        taskCreatedTime: Date.now(),
        options: {
            bitRate: 128,
            format: 'MP3'
        }
    }
};

const initialState: RendererState = {
    rendering: true,
    tasks: {}
};

const existsFreeRenderTask = (tasks: Dictionary<RenderTask>) => {
    return Object.values(tasks).filter((t) => t.state === RenderTaskState.WAITING).length > 0;
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
                        [id]: { state: RenderTaskState.COMPLETE },
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
                        level: RenderTaskLevel.NORMAL,
                        state: RenderTaskState.WAITING,
                        taskCreatedTime: Date.now(),
                        effectType: editor.effect,
                        effectOptions: editor.effectOptions,
                        segments: [
                            { start: editor.clipRegion[0], end: editor.clipRegion[1] }
                        ],
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
                        if(task && task.state === RenderTaskState.STOPPED)
                            newPayload[k] = { state: RenderTaskState.WAITING };
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
                            newPayload[k] = { state: RenderTaskState.STOPPED };
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
                        map[id] = { state: RenderTaskState.STOPPED };
                        return map;
                    }, {}));
                    dispatch.render[REDUCER_SET_RENDERING](false);
                });
            }
        };
    }
};