import {ipcRenderer} from "electron";
import { AnyAction, Dispatch } from 'redux';

export const ELECTRON_STORE_ACTION_EVENT = 'STORE_ACTION';

export default (store: any) => {
    return (next: Dispatch<AnyAction>) => {
        ipcRenderer.on(ELECTRON_STORE_ACTION_EVENT, (e, arg) => next(arg));
        return (action: AnyAction) => {
            let { type, ...data } = action;
            let actionType = String(type);
            if (actionType.toLowerCase().startsWith('electron')) {
                ipcRenderer.send(ELECTRON_STORE_ACTION_EVENT, {
                    type: actionType.replace(/electron\/?/g, ''), 
                    payload: data
                });
            }
            return next(action);
        }
    }
};