import { Action } from 'redux';
import { channel, Channel, SagaMiddleware } from 'redux-saga';
import { put, fork, call, take, join, race, cancel } from 'redux-saga/effects';
import {
    ACTION_RENDER,
    ACTION_RENDER_SUCCESS,
    ACTION_CANCEL_RENDERING,
    ACTION_ENCODE,
    ACTION_ENCODE_SUCCESS,
    RenderAction,
} from './types';
import Renderer from '../../../services/renderer';

const RENDER_BG_ASYNC = 'RENDER_BG_ASYNC';
const MAX_CONCURRENCY = 3;
const tasks: Dictionary<RenderTask> = {};

const pushTask = (task: RenderTask) => {
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
    type: typeof RENDER_BG_ASYNC;
    payload: {
        renderer: Renderer;
        task: RenderTask;
    };
}

function* renderTask({ payload }: RenderBgAsyncAction) {
    const { renderer, task } = payload;
    const buffer = yield* renderer.render(task);
    yield put({
        type: `encode/${ACTION_ENCODE}`,
        payload: {
            options: task.options,
            buffer
        }
    });
    const mp3Buf: Int8Array[] = (yield take(`render/${ACTION_ENCODE_SUCCESS}`)).payload;
    yield put({
        type: ACTION_RENDER_SUCCESS, payload: {
            id: task.id,
            result: mp3Buf
        }
    });
}

const cancelSelectorCreator = (id: string) => {
    return ({ type, payload }: any) => {
        return (type === ACTION_CANCEL_RENDERING) && id === payload;
    };
};

function* popRenderTask(chan: Channel<RenderAction>) {
    const renderer = new Renderer();
    while (true) {
        const { payload } = yield take(chan);
        if (hasTask(payload.id)) {
            const task = yield fork(renderTask, { type: RENDER_BG_ASYNC, payload: { task: payload, renderer }});
            yield race({
                cancel: take(cancelSelectorCreator(task.id)),
                complete: join(task)
            });
            yield cancel(task);
            removeTask(payload);
        }
    }
}

export function* cancelTaskSaga() {
    while (true) {
        const { payload } = yield take(ACTION_CANCEL_RENDERING);
        removeTask(payload);
    }
}

export function* renderSaga() {
    const chan = yield call(channel);
    for (let i = 0; i < MAX_CONCURRENCY; i++) {
        yield fork(popRenderTask, chan);
    }
    while (true) {
        const action = yield take(ACTION_RENDER);
        pushTask(action);
        yield put(chan, action);
    }
}

export default (middleware: SagaMiddleware<{}>) => {
    middleware.run(renderSaga);
    middleware.run(cancelTaskSaga);
};