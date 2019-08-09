import download from '../utils/download';
import getArrayBuffer from '../utils/getArrayBuffer';

export default (
    blob: Blob,
    path: string
) => {
    return new Promise((resolve, reject) => {
        if (window.__ELECTRON__) {
            getArrayBuffer(blob).then((arrayBuffer: ArrayBuffer) => {
                const fs = require('fs');
                fs.writeFile(path, Buffer.from(new Uint8Array(arrayBuffer)), (err: Error|null, result: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            }, reject);
        } else {
            const filename = path.substring(path.lastIndexOf('/') + 1);
            download(filename, blob);
            resolve();
        }
    });
};