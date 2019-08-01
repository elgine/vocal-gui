import { init, RematchRootState } from '@rematch/core';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import createWorkerMiddleware from './middlewares/workerMiddleware';
import workers from '../workers';
import models from './models';
import plugins from './plugins';
import { StateWithHistory } from 'redux-undo';
import importSagas from './models/editor/importSaga';

const saga = createSagaMiddleware();
const worker = createWorkerMiddleware(workers);

const store = init({
    models,
    redux: {
        middlewares: [worker, saga, thunk]
    },
    plugins
});

// Run sagas
importSagas(saga);

export type Models = typeof models;
export type RootState = StateWithHistory<RematchRootState<Models>>;

export default store;