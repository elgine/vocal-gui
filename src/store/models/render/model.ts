import { batch } from 'react-redux';
import path from 'path-browserify';
import {
    RendererState,
    REDUCER_SET_TASKS_STATE,
    REDUCER_ADD_RENDER_TASK,
    REDUCER_SET_RENDERING,
    REDUCER_REMOVE_RENDER_TASK,
    REDUCER_CLEAR_TASKS,
    ACTION_CANCEL_RENDERING,
    ACTION_RENDER,
    ACTION_RESUME_RENDERING,
    ACTION_CANCEL_RENDERING_ALL,
    ACTION_RENDER_SUCCESS,
    ACTION_STOP_RENDERING,
    ACTION_STOP_RENDERING_ALL,
    ACTION_RENDER_PROGRESS,
    ACTION_RENDER_FAILED
} from './types';
import { RootState } from '../../index';
import uuid from 'uuid/v4';
import { ACTION_SHOW_MESSAGE } from '../message/type';
import { RenderTask } from '../../../services/renderer';
import downloader from '../../../services/downloader';

const initialState: RendererState = {
    rendering: true,
    tasks: {}
};

const existsFreeRenderTask = (tasks: Dictionary<RenderTask>) => {
    return Object.values(tasks).filter((t) => t.state === 0).length > 0;
};

const getTaskIds = (tasks: Dictionary<RenderTask>) => {
    let taskIds = {};
    // eslint-disable-next-line guard-for-in
    for (let k in tasks) {
        taskIds[k] = k;
    }
    return taskIds;
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
            [ACTION_RENDER_PROGRESS](payload: Dictionary<{state: number}>) {
                dispatch.render[REDUCER_SET_TASKS_STATE](payload);
            },
            [ACTION_RENDER_FAILED]({ id, error }: {id: string; error: Error}, { present }: RootState) {
                batch(() => {
                    dispatch.render[REDUCER_SET_TASKS_STATE]({
                        [id]: { state: -1 },
                    });
                    if (existsFreeRenderTask(present.render.tasks)) {
                        dispatch.render[REDUCER_SET_RENDERING](false);
                    }
                    dispatch.message[ACTION_SHOW_MESSAGE]({ msgType: 'ERROR', msg: 'EXPORT_FAILED' });
                });
            },
            [ACTION_RENDER_SUCCESS]({ id, blob }: {id: string; blob: Blob}, { present }: RootState) {
                const task = present.render.tasks[id];
                if (!task) return;
                const exportParams = task.exportParams;
                const absPath = path.resolve(exportParams.path || '', `${exportParams.title}.${exportParams.format.toLowerCase()}`);
                downloader(blob, absPath);
                batch(() => {
                    dispatch.render[REDUCER_SET_TASKS_STATE]({
                        [id]: { state: 1 },
                    });
                    if (existsFreeRenderTask(present.render.tasks)) {
                        dispatch.render[REDUCER_SET_RENDERING](false);
                    }
                    dispatch.message[ACTION_SHOW_MESSAGE]({ msgType: 'SUCCESS', msg: 'EXPORT_SUCCESS' });
                });
            },
            [ACTION_RENDER](payload: ExportParams, { present }: RootState) {
                batch(() => {
                    const { editor } = present;
                    if (!editor.source) return;
                    const newTask: RenderTask = {
                        id: uuid(),
                        title: editor.title,
                        level: 0,
                        state: 0,
                        taskCreatedTime: Date.now(),
                        source: editor.source,
                        effectType: editor.effectType,
                        effectOptions: editor.effectOptions,
                        clipRegion: editor.clipRegion,
                        exportParams: payload
                    };
                    dispatch.render[REDUCER_ADD_RENDER_TASK](newTask);
                    dispatch.render[REDUCER_SET_RENDERING](true);
                    dispatch({ type: ACTION_RENDER, payload: newTask });
                });
            },
            [ACTION_RESUME_RENDERING](payload: Dictionary<string> | undefined, { present }: RootState) {
                batch(() => {
                    let tasks: RenderTask[] = [];
                    let taskStates = {};
                    /* eslint-disable */
                    for (let k in payload) {
                        const task = present.render.tasks[k];
                        if(task && task.state === -2){
                            taskStates[k] = { state: 0 };
                            tasks.push({
                                ...task,
                                state: 0
                            });
                        }          
                    }
                    dispatch.render[REDUCER_SET_TASKS_STATE](taskStates);
                    dispatch.render[REDUCER_SET_RENDERING](true);
                    dispatch({type: ACTION_RENDER, payload: tasks});
                });
            },
            [ACTION_CANCEL_RENDERING](payload: Dictionary<string>, { present }: RootState) {
                batch(() => {
                    dispatch.render[REDUCER_REMOVE_RENDER_TASK](payload);
                    dispatch({type: ACTION_CANCEL_RENDERING, payload});
                    if (existsFreeRenderTask(present.render.tasks)) {
                        dispatch.render[REDUCER_SET_RENDERING](false);
                    }
                });
            },
            [ACTION_CANCEL_RENDERING_ALL](payload: any, {present}: RootState) {
                batch(() => {
                    const taskIds = getTaskIds(present.render.tasks);
                    dispatch.render[REDUCER_REMOVE_RENDER_TASK](taskIds);
                    dispatch({type: ACTION_CANCEL_RENDERING, payload: taskIds});
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
                    dispatch({type: ACTION_STOP_RENDERING, payload});
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
                    dispatch({type: ACTION_STOP_RENDERING, payload: getTaskIds(present.render.tasks)});
                    dispatch.render[REDUCER_SET_RENDERING](false);
                });
            }
        };
    }
};