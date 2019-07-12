import { fork, take, put, call, cancel, takeEvery } from 'redux-saga/effects';
import {
    ACTION_LOAD_FILE_FROM_LOCAL,
    ACTION_LOAD_FILE_FROM_URL,
    LoadFileFromURLAction,
    LoadFileFromLocalAction,
    ACTION_CANCEL_LOAD_FILE,
    ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE,
    ACTION_LOAD_FILE_FROM_URL_COMPLETE,
    ACTION_LOAD_FILE_FAILED,
} from './types';
import { loadFromLocal, loadFromUrl } from '../../../utils/loader';

function* doImportFromLocal(action: LoadFileFromLocalAction) {
    try {
        const buf = yield loadFromLocal(action.payload);
        yield put({ type: `source/${ACTION_LOAD_FILE_FROM_LOCAL_COMPLETE}`, payload: buf });
    } catch (e) {
        yield put({ type: `source/${ACTION_LOAD_FILE_FAILED}`, payload: e });
    }
}

function* doImportFromURL(action: LoadFileFromURLAction) {
    try {
        const buf = yield loadFromUrl(action.payload);
        yield put({ type: `source/${ACTION_LOAD_FILE_FROM_URL_COMPLETE}`, payload: buf });
    } catch (e) {
        yield put({ type: `source/${ACTION_LOAD_FILE_FAILED}`, payload: e });
    }
}

function* importFromLocal(action: LoadFileFromLocalAction) {
    const task = yield fork(doImportFromLocal, action);
    yield take(`source/${ACTION_CANCEL_LOAD_FILE}`);
    yield cancel(task);
}

function* importFromUrl(action: LoadFileFromURLAction) {
    const task = yield fork(doImportFromURL, action);
    yield take(`source/${ACTION_CANCEL_LOAD_FILE}`);
    yield cancel(task);
}

export function* importLocalSaga() {
    yield takeEvery(`source/${ACTION_LOAD_FILE_FROM_LOCAL}`, importFromLocal);
}

export function* importUrlSaga() {
    yield takeEvery(`source/${ACTION_LOAD_FILE_FROM_URL}`, importFromUrl);
}