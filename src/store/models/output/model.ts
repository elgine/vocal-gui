import { batch } from 'react-redux';
import {
    OutputTaskStage,
    OutputState,
    OutputTask,
    REDUCER_SET_TASKS_STATE,
    REDUCER_ADD_OUTPUT_TASK,
    REDUCER_SET_OUTPUTING,
    REDUCER_REMOVE_OUTPUT_TASK,
    ACTION_CANCEL_OUTPUT,
    ACTION_CANCEL_OUTPUT_ALL,
    ACTION_OUTPUT,
    ACTION_RESUME_OUTPUT,
    ACTION_STOP_OUTPUT,
    ACTION_STOP_OUTPUT_ALL,
    ACTION_OUTPUT_SUCCESS,
    ACTION_OUTPUT_FAILED,
    ACTION_OUTPUT_PROGRESS
} from './types';
import { ACTION_LOAD_SOURCE } from '../editor/types';
import { RootState } from '../../index';
import uuid from 'uuid/v4';
import { ACTION_SHOW_MESSAGE } from '../message/type';

const initialState: OutputState = {
    outputing: true,
    tasks: {}
};

const existsFreeOutputTask = (tasks: Dictionary<OutputTask>) => {
    return Object.values(tasks).filter((t) => t.state === 0).length > 0;
};

const getTaskIds = (tasks: Dictionary<OutputTask>) => {
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
        [REDUCER_SET_TASKS_STATE](state: OutputState, payload: Dictionary<AnyOf<Omit<OutputTask, 'id'>>>) {
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
        [REDUCER_REMOVE_OUTPUT_TASK](state: OutputState, payload: Dictionary<string>) {
            let newTasks = {};
            for (let k in state.tasks) {
                if (!payload[k]) {
                    newTasks[k] = state.tasks[k];
                }
            }
            state.tasks = newTasks;
            return state;
        },
        [REDUCER_ADD_OUTPUT_TASK](state: OutputState, payload: OutputTask) {
            state.tasks[payload.id] = payload;
            return state;
        },
        [REDUCER_SET_OUTPUTING](state: OutputState, payload: boolean) {
            state.outputing = payload;
            return state;
        }
    },
    effects: (dispatch: any) => {
        return {
            [ACTION_OUTPUT_PROGRESS](payload: Dictionary<{state: number; stage: number}>) {
                dispatch.output[REDUCER_SET_TASKS_STATE](payload);
            },
            [ACTION_OUTPUT_FAILED]({ id, error }: {id: string; error: Error}, { present }: RootState) {
                batch(() => {
                    dispatch.output[REDUCER_SET_TASKS_STATE]({
                        [id]: { state: -1 },
                    });
                    if (existsFreeOutputTask(present.output.tasks)) {
                        dispatch.output[REDUCER_SET_OUTPUTING](false);
                    }
                    dispatch.message[ACTION_SHOW_MESSAGE]({
                        msgType: 'ERROR',
                        msg: 'EXPORT_FAILED',
                        native: present.window.state === 'minimize'
                    });
                });
            },
            [ACTION_OUTPUT_SUCCESS]({ id, blob }: {id: string; blob: Blob}, { present }: RootState) {
                const task = present.output.tasks[id];
                if (!task) return;
                batch(() => {
                    dispatch.output[REDUCER_SET_TASKS_STATE]({
                        [id]: { state: 3, source: undefined },
                    });
                    if (existsFreeOutputTask(present.output.tasks)) {
                        dispatch.output[REDUCER_SET_OUTPUTING](false);
                    }
                    dispatch.message[ACTION_SHOW_MESSAGE]({
                        msgType: 'SUCCESS',
                        msg: 'EXPORT_SUCCESS',
                        showConfirm: true,
                        confirmLabel: 'EDIT',
                        confirmAction: `editor/${ACTION_LOAD_SOURCE}`,
                        confirmParams: {
                            type: 'FILE',
                            value: blob
                        }
                    });
                });
            },
            [ACTION_OUTPUT](payload: OutputParams, { present }: RootState) {
                batch(() => {
                    const { editor } = present;
                    if (!editor.source) return;
                    const newTask: OutputTask = {
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
                    dispatch.output[REDUCER_ADD_OUTPUT_TASK](newTask);
                    dispatch.output[REDUCER_SET_OUTPUTING](true);
                    dispatch({ type: ACTION_OUTPUT, payload: newTask });
                });
            },
            [ACTION_RESUME_OUTPUT](payload: Dictionary<string> | undefined, { present }: RootState) {
                batch(() => {
                    let tasks: OutputTask[] = [];
                    let taskStates = {};
                    /* eslint-disable */
                    for (let k in payload) {
                        const task = present.output.tasks[k];
                        if(task && task.state === -2){
                            taskStates[k] = { state: 0 };
                            tasks.push({
                                ...task,
                                state: 0
                            });
                        }          
                    }
                    dispatch.output[REDUCER_SET_TASKS_STATE](taskStates);
                    dispatch.output[REDUCER_SET_OUTPUTING](true);
                    dispatch({type: ACTION_OUTPUT, payload: tasks});
                });
            },
            [ACTION_CANCEL_OUTPUT](payload: Dictionary<string>, { present }: RootState) {
                batch(() => {
                    dispatch.output[REDUCER_REMOVE_OUTPUT_TASK](payload);
                    dispatch({type: ACTION_CANCEL_OUTPUT, payload});
                    if (existsFreeOutputTask(present.output.tasks)) {
                        dispatch.output[REDUCER_SET_OUTPUTING](false);
                    }
                });
            },
            [ACTION_CANCEL_OUTPUT_ALL](payload: any, {present}: RootState) {
                batch(() => {
                    const taskIds = getTaskIds(present.output.tasks);
                    dispatch.output[REDUCER_REMOVE_OUTPUT_TASK](taskIds);
                    dispatch({type: ACTION_CANCEL_OUTPUT, payload: taskIds});
                    dispatch.output[REDUCER_SET_OUTPUTING](false);
                });
            },
            [ACTION_STOP_OUTPUT](payload: Dictionary<string>, { present }: RootState) {
                batch(() => {
                    let newPayload = {};
                    /* eslint-disable */
                    for (let k in payload) {
                        const task = present.output.tasks[k];
                        if(task && task.state >= 0 && task.state < 1)
                            newPayload[k] = { state: -2 };
                    }
                    dispatch.output[REDUCER_SET_TASKS_STATE](newPayload);
                    dispatch({type: ACTION_CANCEL_OUTPUT, payload});
                    if (existsFreeOutputTask(present.output.tasks)) {
                        dispatch.output[REDUCER_SET_OUTPUTING](false);
                    }
                });
            },
            [ACTION_STOP_OUTPUT_ALL](payload: any, { present }: RootState) {
                batch(() => {
                    dispatch.output[REDUCER_SET_TASKS_STATE](Object.keys(present.output.tasks).reduce((map, id) => {
                        map[id] = { state: -2 };
                        return map;
                    }, {}));
                    dispatch({type: ACTION_CANCEL_OUTPUT, payload: getTaskIds(present.output.tasks)});
                    dispatch.output[REDUCER_SET_OUTPUTING](false);
                });
            }
        };
    }
};