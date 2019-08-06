import download from '../utils/download';

export default (
    blob: Blob,
    path: string
) => {
    return new Promise((resolve, reject) => {
        if (window.ELECTRON) {
            const fs = require('fs');
            fs.writeFile(path, blob, (err: Error|null, result: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        } else {
            const filename = path.substring(path.lastIndexOf('/') + 1);
            download(filename, blob);
            resolve();
        }
    });
};