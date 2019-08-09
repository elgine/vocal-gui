import { take, put, call, actionChannel, fork, race, cancel, join } from 'redux-saga/effects';
import { AnyAction } from 'redux';
import WAVHeaderWriter from '../../../services/WAVHeaderWriter';

export const ACTION_ENCODE_WAV = 'ACTION_ENCODE_WAV';
export const ACTION_ENCODE_WAV_SUCCESS = 'ACTION_ENCODE_WAV_SUCCESS';
export const ACTION_CANCEL_ENCODE_WAV = 'ACTION_CANCEL_ENCODE_WAV';

function* doEncodeWAV({ id, buffer, ...others }: any) {
    const arrayBuffer = yield call(WAVHeaderWriter, buffer);
    yield put({ type: ACTION_ENCODE_WAV_SUCCESS, payload: { id, blob: new Blob([new Uint8Array(arrayBuffer)]), ...others }});
}

const isCancelEncodeWAVAction = (id: string) => {
    return (action: AnyAction) => {
        if (action.type === ACTION_CANCEL_ENCODE_WAV) {
            return typeof action.payload === 'string' ? action.payload === id : action.payload[id] !== undefined;
        }
        return false;
    };
};

export default function* () {
    const chan = yield actionChannel(ACTION_ENCODE_WAV);
    while (true) {
        const { payload } = yield take(chan);
        const task = yield fork(doEncodeWAV, payload);
        yield race({
            cancel: take(isCancelEncodeWAVAction(payload.id)),
            complete: join(task)
        });
        yield cancel(task);
    }
}