import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import fileReducer from './file/reducer';
import playerReducer from './player/reducer';
import timelineReducer from './timeline/reducer';

const saga = createSagaMiddleware();

const store = init({
    models: {
        file: fileReducer,
        player: playerReducer,
        timeline: timelineReducer
    },
    redux: {
        middlewares: [thunk, saga]
    },
    plugins: [immerPlugin()]
});

// Run sagas

export default store;