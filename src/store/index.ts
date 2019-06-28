import { init } from '@rematch/core';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import playerReducer from './player/reducer';
import timelineReducer from './timeline/reducer';

const saga = createSagaMiddleware();

const store = init({
    models: {
        player: playerReducer,
        timeline: timelineReducer
    },
    redux: {
        middlewares: [thunk, saga]
    }
});

// Run sagas

export default store;