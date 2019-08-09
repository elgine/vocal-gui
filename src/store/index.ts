import { init, RematchRootState } from '@rematch/core';
import createSagaMiddleware from 'redux-saga';
import createWorkerMiddleware from './middlewares/workerMiddleware';
import electronMiddleware from './middlewares/electronMiddleware';
import workers from '../workers';
import models from './models';
import plugins from './plugins';
import { StateWithHistory } from 'redux-undo';
import importSagas from './models/editor/importSaga';
import prerenderSaga from './models/editor/prerenderSaga';
import outputSaga from './models/output/sagas';

const saga = createSagaMiddleware();
const worker = createWorkerMiddleware(workers);

const middlewares = [worker, saga];
if (window.__ELECTRON__) {
    middlewares.push(electronMiddleware);
}

const store = init({
    models,
    redux: {
        middlewares
    },
    plugins
});

// Run sagas
importSagas(saga);
prerenderSaga(saga);
outputSaga(saga);

export type Models = typeof models;
export type RootState = StateWithHistory<RematchRootState<Models>>;

export default store;