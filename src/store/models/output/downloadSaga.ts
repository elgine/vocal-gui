import { take, put, call, actionChannel, fork, race, cancel, join } from 'redux-saga/effects';
import { AnyAction } from 'redux';
import downloader from '../../../services/downloader';

export const ACTION_DOWNLOAD = 'ACTION_DOWNLOAD';
export const ACTION_DOWNLOAD_SUCCESS = 'ACTION_DOWNLOAD_SUCCESS';
export const ACTION_CANCEL_DOWNLOAD = 'ACTION_CANCEL_DOWNLOAD';

function* doDownload({ id, exportParams, blob }: {id: string;exportParams: any; blob: Blob}) {
    const absPath = (window.__ELECTRON__ ? `${exportParams.path}\\` : '') + `${exportParams.title}.${exportParams.format.toLowerCase()}`;
    yield call(downloader, blob, absPath);
    yield put({ type: ACTION_DOWNLOAD_SUCCESS, payload: { id }});
}

const isCancelDownloadAction = (id: string) => {
    return (action: AnyAction) => {
        if (action.type === ACTION_CANCEL_DOWNLOAD) {
            return typeof action.payload === 'string' ? action.payload === id : action.payload[id] !== undefined;
        }
        return false;
    };
};

export default function* () {
    const chan = yield actionChannel(ACTION_DOWNLOAD);
    while (true) {
        const { payload } = yield take(chan);
        const task = yield fork(doDownload, payload);
        yield race({
            cancel: take(isCancelDownloadAction(payload.id)),
            complete: join(task)
        });
        yield cancel(task);
    }
}