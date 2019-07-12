import {ipcRenderer} from "electron";
import { AnyAction, Dispatch } from 'redux';

export default (store: any) => {
    return (next: Dispatch<AnyAction>) => {
        return (action: AnyAction) => {
            
        }
    }
};