import { fork, take, put, call, cancel, takeEvery } from 'redux-saga/effects';
import {
    LoadFileFromURLAction,
    LoadFileFromLocalAction,
    ACTION_CANCEL_LOAD_SORUCE,
    ACTION_LOAD_SOURCE_SUCCESS,
    ACTION_LOAD_FROM_LOCAL,
    ACTION_LOAD_FROM_URL,
    ACTION_LOAD_FAILED,
} from './types';
import { loadFromLocal, loadFromUrl } from '../../../utils/loader';

function* doImportFromLocal({ payload }: LoadFileFromLocalAction) {
    try {
        const buf = yield call(loadFromLocal, payload);
        yield put({
            type: `source/${ACTION_LOAD_SOURCE_SUCCESS}`, payload: {
                buffer: buf,
                title: payload.name.substring(payload.name.lastIndexOf('/'))
            }
        });
    } catch (e) {
        yield put({ type: `source/${ACTION_LOAD_FAILED}`, payload: e });
    }
}

function* doImportFromURL({ payload }: LoadFileFromURLAction) {
    try {
        const buf = yield call(loadFromUrl, payload);
        yield put({
            type: `source/${ACTION_LOAD_SOURCE_SUCCESS}`, payload: {
                buffer: buf,
                title: payload.substring(payload.lastIndexOf('/'))
            }
        });
    } catch (e) {
        yield put({ type: `source/${ACTION_LOAD_FAILED}`, payload: e });
    }
}

function* importFromLocal(action: LoadFileFromLocalAction) {
    const task = yield fork(doImportFromLocal, action);
    yield take(`source/${ACTION_CANCEL_LOAD_SORUCE}`);
    yield cancel(task);
}

function* importFromUrl(action: LoadFileFromURLAction) {
    const task = yield fork(doImportFromURL, action);
    yield take(`source/${ACTION_CANCEL_LOAD_SORUCE}`);
    yield cancel(task);
}

export function* importLocalSaga() {
    yield takeEvery(`source/${ACTION_LOAD_FROM_LOCAL}`, importFromLocal);
}

export function* importUrlSaga() {
    yield takeEvery(`source/${ACTION_LOAD_FROM_URL}`, importFromUrl);
}