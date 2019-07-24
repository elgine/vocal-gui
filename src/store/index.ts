import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import createWorkerMiddleware from './middlewares/workerMiddleware';
import sourceSagas from './models/source/sagas';
import renderSagas from './models/render/sagas';
import workers from '../workers';
import models from './models';
import { combineHistoryReducers } from './models/history/enhancer';
import { ACTION_LOAD_SOURCE_SUCCESS } from './models/source/types';

const saga = createSagaMiddleware();
const worker = createWorkerMiddleware(workers);

const store = init({
    models,
    redux: {
        middlewares: [worker, saga, thunk],
        combineReducers: combineHistoryReducers({
            source: {
                whiteList: [
                    `source/${ACTION_LOAD_SOURCE_SUCCESS}`
                ]
            },
            timeline: {
                whiteList: [
                    `timeline/`
                ]
            }
        })
    },
    plugins: [immerPlugin()]
});

// Run sagas
sourceSagas(saga);
renderSagas(saga);

export default store;