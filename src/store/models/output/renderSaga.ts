import { Action } from 'redux';
import { channel, Channel, SagaMiddleware } from 'redux-saga';
import { put, fork, call, take, join, race, cancel, delay } from 'redux-saga/effects';
import Renderer from '../../../services/renderer';
import { OutputTask } from './types';

export const ACTION_RENDER = 'ACTION_RENDER';
export const ACTION_RENDER_PROGRESS = 'ACTION_RENDER_PROGRESS';
export const ACTION_CANCEL_RENDER = 'ACTION_CANCEL_RENDER';
export const ACTION_RENDER_FAILED = 'ACTION_RENDER_FAILED';
export const ACTION_RENDER_SUCCESS = 'ACTION_RENDER_SUCCESS';

const ACTION_RENDER_BG_ASYNC = 'ACTION_RENDER_BG_ASYNC';
const MAX_CONCURRENCY = 3;
const tasks: Dictionary<OutputTask> = {};

const pushTask = (task: OutputTask) => {
    tasks[task.id] = task;
};

const hasTask = (id: string) => {
    return Reflect.has(tasks, id);
};

const removeTask = (id: string) => {
    if (hasTask(id)) {
        Reflect.deleteProperty(tasks, id);
    }
};

interface RenderBgAsyncAction extends Action{
    type: typeof ACTION_RENDER_BG_ASYNC;
    payload: {
        renderer: Renderer;
        task: OutputTask;
    };
}

function* renderTask({ payload }: RenderBgAsyncAction) {
    const { renderer, task } = payload;
    try {
        const buffer: AudioBuffer = yield* renderer.render(task, (v: number) => {
            task.state = v;
        });
        yield put({
            type: ACTION_RENDER_SUCCESS,
            payload: {
                id: task.id,
                exportParams: task.exportParams,
                buffer
            }
        });
    } catch (e) {
        yield put({
            type: ACTION_RENDER_FAILED,
            payload: {
                id: task.id,
                error: e
            }
        });
    } finally {
        removeTask(task.id);
    }
}

const cancelSelectorCreator = (id?: string) => {
    return ({ type, payload }: any) => {
        return (type === ACTION_CANCEL_RENDER) && (!id || id === payload);
    };
};

function* popRenderTask(chan: Channel<OutputTask>) {
    const renderer = new Renderer();
    while (true) {
        const task: OutputTask = yield take(chan);
        if (hasTask(task.id)) {
            const bgThread = yield fork(renderTask, { type: ACTION_RENDER_BG_ASYNC, payload: { task, renderer }});
            yield race({
                cancel: take(cancelSelectorCreator(task.id)),
                complete: join(bgThread)
            });
            yield cancel(bgThread);
            removeTask(task.id);
        }
    }
}

function* cancelTaskSaga() {
    while (true) {
        const { payload } = yield take(cancelSelectorCreator());
        removeTask(payload);
    }
}

function* renderProgressSaga() {
    while (true) {
        yield delay(100);
        if (Object.values(tasks).filter(t => t.state >= 0 && t.state < 1).length <= 0) {
            yield take(ACTION_RENDER);
        }
        let progress: Dictionary<{state: number}> = {};
        // eslint-disable-next-line guard-for-in
        for (let k in tasks) {
            progress[k] = { state: tasks[k].state };
        }
        yield put({ type: ACTION_RENDER_PROGRESS, payload: progress });
    }
}

function* renderSaga() {
    const chan = yield call(channel);
    for (let i = 0; i < MAX_CONCURRENCY; i++) {
        yield fork(popRenderTask, chan);
    }
    while (true) {
        const { payload } = yield take(ACTION_RENDER);
        const tasks = Array.isArray(payload) ? payload.map((t) => ({ ...t })) : [{ ...payload }];
        for (let task of tasks) {
            pushTask(task);
            yield put(chan, task);
        }
    }
}

export default (middleware: SagaMiddleware<{}>) => {
    middleware.run(renderProgressSaga);
    middleware.run(renderSaga);
    middleware.run(cancelTaskSaga);
};