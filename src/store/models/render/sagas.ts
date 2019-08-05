import { Action } from 'redux';
import { channel, Channel, SagaMiddleware } from 'redux-saga';
import { put, fork, call, take, join, race, cancel, delay } from 'redux-saga/effects';
import {
    ACTION_RENDER,
    ACTION_RENDER_SUCCESS,
    ACTION_CANCEL_RENDERING,
    ACTION_ENCODE,
    ACTION_ENCODE_SUCCESS,
    ACTION_RENDER_PROGRESS,
    ACTION_STOP_RENDERING,
} from './types';
import { ACTION_SHOW_MESSAGE } from '../message/type';
import Renderer, { RenderTask } from '../../../services/renderer';
import ID3Writer from '../../../services/ID3TagWriter';
import downloader from '../../../services/downloader';
import WAVHeaderWriter from '../../../services/WAVHeaderWriter';

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

const decompose = (audioBuffer: AudioBuffer) => {
    const buffers: Float32Array[] = [];
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        buffers.push(audioBuffer.getChannelData(i));
    }
    return buffers;
};

function* encodeMP3(buffer: AudioBuffer, bitRate: number) {
    yield put({
        type: `worker/encode/${ACTION_ENCODE}`, payload: {
            buffer: decompose(buffer),
            options: {
                sampleRate: buffer.sampleRate,
                bitRate: bitRate,
                channels: buffer.numberOfChannels
            }
        }
    });
    const { payload } = yield take(ACTION_ENCODE_SUCCESS);
    return new Blob(payload, { type: 'audio/mp3' });
}

function* encodeWAV(buffer: AudioBuffer) {
    const result = yield call(WAVHeaderWriter, buffer);
    return new Blob([new Int8Array(result)], { type: 'audio/wav' });
}

function* encode(buffer: AudioBuffer, { bitRate, format }: {format: ExportFormat; bitRate: number}) {
    if (format === 'MP3') {
        return yield call(encodeMP3, buffer, bitRate);
    } else {
        return yield call(encodeWAV, buffer);
    }
}

function* renderTask({ payload }: RenderBgAsyncAction) {
    const { renderer, task } = payload;
    try {
        const buffer: AudioBuffer = yield* renderer.render(task, (v: number) => {
            task.state = v;
        });
        const exportParams = task.exportParams;
        const absPath = `${exportParams.path || ''}\\${exportParams.title}.${exportParams.format.toLowerCase()}`;
        const blob = yield encode(buffer, exportParams);
        yield call(downloader, blob, absPath);
        yield put({
            type: `render/${ACTION_RENDER_SUCCESS}`,
            payload: {
                id: task.id
            }
        });
    } catch (e) {
        yield put({
            type: `message/${ACTION_SHOW_MESSAGE}`,
            payload: {
                msgType: 'ERROR',
                msg: e.message
            }
        });
    } finally {
        removeTask(task.id);
    }
}

const cancelSelectorCreator = (id?: string) => {
    return ({ type, payload }: any) => {
        return (type === ACTION_CANCEL_RENDERING || type === ACTION_STOP_RENDERING) && (!id || id === payload);
    };
};

function* popRenderTask(chan: Channel<RenderTask>) {
    const renderer = new Renderer();
    while (true) {
        const task: RenderTask = yield take(chan);
        if (hasTask(task.id)) {
            const bgThread = yield fork(renderTask, { type: RENDER_BG_ASYNC, payload: { task, renderer }});
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
        yield put({ type: `render/${ACTION_RENDER_PROGRESS}`, payload: progress });
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