import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import sourceReducer from './source/reducer';
import playerReducer from './player/reducer';
import timelineReducer from './timeline/reducer';
import { importUrlSaga, importLocalSaga } from './source/sagas';

const saga = createSagaMiddleware();

const store = init({
    models: {
        source: sourceReducer,
        player: playerReducer,
        timeline: timelineReducer
    },
    redux: {
        middlewares: [saga, thunk]
    },
    plugins: [immerPlugin()]
});

// Run sagas
saga.run(importLocalSaga);
saga.run(importUrlSaga);

export default store;