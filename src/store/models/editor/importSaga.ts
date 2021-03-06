import { fork, take, put, call, cancel, takeEvery } from 'redux-saga/effects';
import uuid from 'uuid/v4';
import { SagaMiddleware } from 'redux-saga';
import {
    ACTION_LOAD_FROM_EXTERNAL,
    ACTION_CANCEL_LOAD_SORUCE,
    ACTION_LOAD_SOURCE_SUCCESS,
    ACTION_LOAD_FAILED,
} from './types';
import { loadFromLocal, loadFromUrl } from '../../../utils/loader';
import { Action } from 'redux';

interface LoadFromExternalAction extends Action<string>{
    payload: string | File | Blob;
}

function* doImportFromExternal({ payload }: LoadFromExternalAction) {
    try {
        const name = payload instanceof File ? payload.name : (payload instanceof Blob ? uuid() : payload);
        const buf = typeof payload === 'string' ? yield call(loadFromUrl, payload) : yield call(loadFromLocal, payload);
        yield put({
            type: `editor/${ACTION_LOAD_SOURCE_SUCCESS}`, payload: {
                buffer: buf,
                title: name.substring(name.lastIndexOf('/'), name.lastIndexOf('.'))
            }
        });
    } catch (e) {
        yield put({
            type: `editor/${ACTION_LOAD_FAILED}`, payload: {
                message: 'LOAD_SOURCE_FAILED'
            }
        });
    }
}

function* importFromExternal(action: LoadFromExternalAction) {
    const task = yield fork(doImportFromExternal, action);
    yield take(`editor/${ACTION_CANCEL_LOAD_SORUCE}`);
    yield cancel(task);
}

export function* importExternalSaga() {
    yield takeEvery(`editor/${ACTION_LOAD_FROM_EXTERNAL}`, importFromExternal);
}

export default (sagaMiddleware: SagaMiddleware<{}>) => {
    sagaMiddleware.run(importExternalSaga);
};