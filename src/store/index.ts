import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import createWorkerMiddleware from "./middlewares/workerMiddleware";
import { importUrlSaga, importLocalSaga } from './models/source/sagas';
import workers from "../workers";
import models from './models';

const saga = createSagaMiddleware();
const worker = createWorkerMiddleware(workers);

const store = init({
    models,
    redux: {
        middlewares: [worker, saga, thunk]
    },
    plugins: [immerPlugin()]
});

// Run sagas
saga.run(importLocalSaga);
saga.run(importUrlSaga);

export default store;