import { put, fork, call, take, actionChannel, race, cancel } from 'redux-saga/effects';
import { getRenderer } from '../../../processor';
import { ACTION_RENDER, ACTION_CANCEL_RENDERING } from './types';

const RENDERER_FREE = 'RENDERER_FREE';
const RENDERER_FINISH = 'RENDERER_FINISH';
const START_TO_RENDER = 'START_TO_RENDER';

function* doExport({ type, payload }) {
    const { renderer, task } = payload;
    yield;
}

export function* exportSaga() {
    const channels = yield actionChannel(ACTION_RENDER);
    while (true) {
        const { payload } = yield take(channels);
        const { renderer } = yield take(RENDERER_FREE);
        const task = yield fork(doExport, { type: START_TO_RENDER, payload: { task: payload, renderer }});
        yield race({
            complete: take(RENDERER_FINISH),
            cancel: take((action) => action.type === ACTION_CANCEL_RENDERING && payload === action.payload)
        });
        cancel(task);
    }
}