import { put, take, actionChannel } from 'redux-saga/effects';
import { SagaMiddleware } from 'redux-saga';
import { ACTION_OUTPUT,  ACTION_CANCEL_OUTPUT, ACTION_OUTPUT_SUCCESS, ACTION_OUTPUT_PROGRESS, ACTION_OUTPUT_FAILED } from './types';
import encodeWAVSaga, { ACTION_CANCEL_ENCODE_WAV, ACTION_ENCODE_WAV_SUCCESS } from './encodeWAVSaga';
import encodeMP3Sagas, { ACTION_CANCEL_ENCODE_MP3, ACTION_ENCODE_MP3_PROGRESS, ACTION_ENCODE_MP3_SUCCESS } from './encodeMP3Saga';
import downloadSaga, { ACTION_CANCEL_DOWNLOAD, ACTION_DOWNLOAD, ACTION_DOWNLOAD_SUCCESS } from './downloadSaga';
import renderSagas, { ACTION_CANCEL_RENDER, ACTION_RENDER, ACTION_RENDER_FAILED, ACTION_RENDER_PROGRESS, ACTION_RENDER_SUCCESS } from './renderSaga';

function* watchDownloadSuccess() {
    const chan = yield actionChannel(ACTION_DOWNLOAD_SUCCESS);
    while (true) {
        const { payload } = yield take(chan);
        yield put({ type: `output/${ACTION_OUTPUT_SUCCESS}`, payload });
    }
}

function* watchEncodeMP3Progress() {
    const chan = yield actionChannel(ACTION_ENCODE_MP3_PROGRESS);
    while (true) {
        const { payload } = yield take(chan);
        const { id, state } = payload;
        yield put({ type: `output/${ACTION_OUTPUT_PROGRESS}`, payload: { [id]: { id, state: 1 + state }}});
    }
}

function* watchRenderProgress() {
    const chan = yield actionChannel(ACTION_RENDER_PROGRESS);
    while (true) {
        const { payload } = yield take(chan);
        yield put({ type: `output/${ACTION_OUTPUT_PROGRESS}`, payload });
    }
}

function* watchRenderFailed() {
    const chan = yield actionChannel(ACTION_RENDER_FAILED);
    while (true) {
        const { payload } = yield take(chan);
        yield put({ type: `output/${ACTION_OUTPUT_FAILED}`, payload });
    }
}

function* watchEncodeMP3Sucess() {
    const chan = yield actionChannel(ACTION_ENCODE_MP3_SUCCESS);
    while (true) {
        const { payload } = yield take(chan);
        yield put({ type: `output/${ACTION_OUTPUT_PROGRESS}`, payload: { id: payload.id, state: 2 }});
        yield put({ type: ACTION_DOWNLOAD, payload });
    }
}

function* watchEncodeWAVSucess() {
    const chan = yield actionChannel(ACTION_ENCODE_WAV_SUCCESS);
    while (true) {
        const { payload } = yield take(chan);
        yield put({ type: `output/${ACTION_OUTPUT_PROGRESS}`, payload: { id: payload.id, state: 2 }});
        yield put({ type: ACTION_DOWNLOAD, payload });
    }
}

function* watchRenderSuccess() {
    const chan = yield actionChannel(ACTION_RENDER_SUCCESS);
    while (true) {
        const { payload } = yield take(chan);
        yield put({ type: `output/${ACTION_OUTPUT_PROGRESS}`, payload: { id: payload.id, state: 1 }});
        yield put({ type: `ACTION_ENCODE_${payload.exportParams.format}`, payload });
    }
}

function* watchCancelOutput() {
    const chan = yield actionChannel(ACTION_CANCEL_OUTPUT);
    while (true) {
        const { payload } = yield take(chan);
        yield put({ type: ACTION_CANCEL_RENDER, payload });
        yield put({ type: ACTION_CANCEL_ENCODE_MP3, payload });
        yield put({ type: ACTION_CANCEL_ENCODE_WAV, payload });
        yield put({ type: ACTION_CANCEL_DOWNLOAD, payload });
    }
}

function* watchOutput() {
    const chan = yield actionChannel(ACTION_OUTPUT);
    while (true) {
        const { payload } = yield take(chan);
        yield put({ type: ACTION_RENDER, payload });
    }
}

export default (saga: SagaMiddleware) => {
    renderSagas(saga);
    encodeMP3Sagas(saga);
    saga.run(watchEncodeMP3Progress);
    saga.run(downloadSaga);
    saga.run(encodeWAVSaga);
    saga.run(watchOutput);
    saga.run(watchCancelOutput);
    saga.run(watchRenderSuccess);
    saga.run(watchEncodeWAVSucess);
    saga.run(watchEncodeMP3Sucess);
    saga.run(watchRenderFailed);
    saga.run(watchRenderProgress);
    saga.run(watchDownloadSuccess);
};