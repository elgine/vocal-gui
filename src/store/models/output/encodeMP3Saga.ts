import { SagaMiddleware } from 'redux-saga';
import { take, put, call, actionChannel, fork, race, cancel, join, delay } from 'redux-saga/effects';
import { AnyAction } from 'redux';
import ID3TagWriter from '../../../services/ID3TagWriter';

export const ACTION_ENCODE_MP3 = 'ACTION_ENCODE_MP3';
export const ACTION_ENCODE_MP3_SUCCESS = 'ACTION_ENCODE_MP3_SUCCESS';
export const ACTION_CANCEL_ENCODE_MP3 = 'ACTION_CANCEL_ENCODE_MP3';
export const ACTION_ENCODE_MP3_PROGRESS = 'ACTION_ENCODE_MP3_PROGRESS';

let taskId = '';

const decompose = (audioBuffer: AudioBuffer) => {
    const buffers: Float32Array[] = [];
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        buffers.push(audioBuffer.getChannelData(i));
    }
    return buffers;
};

function* watchEncodeMP3WorkerProgress() {
    while (true) {
        const { payload }  = yield take('ACTION_ENCODE_PROGRESS');
        yield put({ type: ACTION_ENCODE_MP3_PROGRESS, payload: { id: taskId, state: payload }});
        yield delay(500);
    }
}

function* doEncodeMP3({ id, buffer, bitRate, ...others }: any) {
    yield put({
        type: 'worker/encode/ACTION_ENCODE', payload: {
            id,
            buffer: decompose(buffer),
            options: {
                sampleRate: buffer.sampleRate,
                bitRate: bitRate,
                channels: buffer.numberOfChannels
            }
        }
    });
    const { payload } = yield take('ACTION_ENCODE_SUCCESS');
    const arrayBuffer = yield call(ID3TagWriter, payload, {
        TLEN: buffer.duration * 1000
    });
    yield put({ type: ACTION_ENCODE_MP3_SUCCESS, payload: { id, blob: new Blob([new Uint8Array(arrayBuffer)]), ...others }});
}

const isCancelEncodeMP3Action = (id: string) => {
    return (action: AnyAction) => {
        if (action.type === ACTION_CANCEL_ENCODE_MP3) {
            return typeof action.payload === 'string' ? action.payload === id : action.payload[id] !== undefined;
        }
        return false;
    };
};

function* encodeMP3Saga() {
    const channel = yield actionChannel(ACTION_ENCODE_MP3);
    while (true) {
        const { payload } = yield take(channel);
        const task = yield fork(doEncodeMP3, payload);
        // Cache task's id
        taskId = payload.id;
        yield race({
            cancel: take(isCancelEncodeMP3Action(payload.id)),
            complete: join(task)
        });
        yield put({ type: 'worker/encode/ACTION_CANCEL_ENCODE' });
        yield cancel(task);
    }
}

export default (saga: SagaMiddleware) => {
    saga.run(encodeMP3Saga);
    saga.run(watchEncodeMP3WorkerProgress);
};