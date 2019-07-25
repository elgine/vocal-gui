import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import createWorkerMiddleware from './middlewares/workerMiddleware';
import sourceSagas from './models/source/sagas';
import renderSagas from './models/render/sagas';
import workers from '../workers';
import models from './models';
import historyPlugin from './models/history/enhancer';
import { ACTION_LOAD_SOURCE_SUCCESS } from './models/source/types';
import { ACTION_SEEK, ACTION_SOURCE_CHANGE, ACTION_ZOOM, ACTION_CLIP_REGION_CHANGE } from './models/timeline/types';
import { ACTION_SWITCH_EFFECT, ACTION_EFFECT_OPTIONS_CHANGE } from './models/effect/type';

const saga = createSagaMiddleware();
const worker = createWorkerMiddleware(workers);

const store = init({
    models,
    redux: {
        middlewares: [worker, saga, thunk]
    },
    plugins: [
        immerPlugin(),
        historyPlugin({
            source: {
                whiteList: [
                    `source/${ACTION_LOAD_SOURCE_SUCCESS}`
                ]
            },
            timeline: {
                whiteList: [
                    `timeline/${ACTION_SOURCE_CHANGE}`,
                    `timeline/${ACTION_SEEK}`,
                    `timeline/${ACTION_ZOOM}`,
                    `timeline/${ACTION_CLIP_REGION_CHANGE}`
                ]
            },
            effect: {
                whiteList: [
                    `effect/${ACTION_SWITCH_EFFECT}`,
                    `effect/${ACTION_EFFECT_OPTIONS_CHANGE}`
                ]
            }
        })
    ]
});

// Run sagas
sourceSagas(saga);
renderSagas(saga);

export default store;