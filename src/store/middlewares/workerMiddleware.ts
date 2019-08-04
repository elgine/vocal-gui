import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
/**
 * Worker middleware, handle those actions with
 * type like `WORKER/${workerName}/${workerCMD}`
 * @param {Dictionary<Worker>} workers worker hashtable
 */
export default (workers: Dictionary<Worker>) => {
    return (store: MiddlewareAPI) => {
        /* eslint-disable guard-for-in */
        for (let k in workers) {
            workers[k].onmessage = (e: MessageEvent) => {
                store.dispatch(e.data);
            };
        }
        return (next: Dispatch<AnyAction>) => {
            return (action: AnyAction) => {
                let { type, payload } = action;
                let actionType = String(type);
                let paths = actionType.split('/');
                if (actionType.toLowerCase().startsWith('worker')) {
                    let workerName = paths[1] || '';
                    if (workers[workerName]) {
                        workers[workerName].postMessage({
                            type: `${workerName}/${paths[2] || ''}`,
                            payload
                        });
                    }
                }
                return next(action);
            };
        };
    };
};