import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
export const ELECTRON_ACTION = 'ELECTRON_ACTION';

export default (store: MiddlewareAPI) => {
    const { ipcRenderer } = require('electron');
    ipcRenderer.on(ELECTRON_ACTION, (e: any, arg: any) => {
        if (arg.type) {
            store.dispatch(arg);
        }
    });
    return (next: Dispatch<AnyAction>) => {
        return (action: AnyAction) => {
            let { type, ...data } = action;
            let actionType = String(type);
            if (actionType.toLowerCase().startsWith('electron')) {
                ipcRenderer.send(ELECTRON_ACTION, {
                    type: actionType.replace(/electron\/?/g, ''),
                    payload: data
                });
            }
            return next(action);
        };
    };
};