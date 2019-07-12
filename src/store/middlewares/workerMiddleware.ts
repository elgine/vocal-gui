import { AnyAction, Dispatch } from 'redux';
/**
 * Worker middleware, handle those actions with
 * type like `WORKER/${workerName}/${workerCMD}`
 * @param {Dictionary<Worker>} workers worker hashtable
 */
export default (workers: Dictionary<Worker>) => {
    return (store: any) => {
        return (next: Dispatch<AnyAction>) => {
            for(let k in workers){
                workers[k].addEventListener('message', (e: MessageEvent) => next(e.data));
            }
            return (action: AnyAction) => {
                let { type, ...data } = action;
                let actionType = String(type);
                let paths = actionType.split('/');
                if (paths[0].toLowerCase() === 'worker') {
                    let workerName = paths[1] || '';
                    let workerCMD = paths[2] || '';
                    if (workers[workerName]) {
                        workers[workerName].postMessage({
                            workerCMD,
                            data
                        });
                    }
                }
                return next(action);
            };
        };
    };
};