import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import models from './models';
import { importUrlSaga, importLocalSaga } from './models/source/sagas';

const saga = createSagaMiddleware();

const store = init({
    models,
    redux: {
        middlewares: [saga, thunk]
    },
    plugins: [immerPlugin()]
});

// Run sagas
saga.run(importLocalSaga);
saga.run(importUrlSaga);

export default store;