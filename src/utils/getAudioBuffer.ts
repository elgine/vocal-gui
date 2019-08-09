
const handleRequestError = (req: XMLHttpRequest) => {
    return new Error(typeof req.responseText === 'object' ? (req.responseText as any).message : req.responseText);
};

export const getAudioBufferFromUrl = (url: string): Promise<AudioBuffer> => {
    return new Promise((resolve, reject) => {
        try {
            let req = new XMLHttpRequest();
            req.onload = () => {
                let arrayBuffer = req.response as ArrayBuffer;
                let ctx = new AudioContext();
                ctx.decodeAudioData(arrayBuffer, resolve, reject);
            };
            req.onerror = (e) => {
                reject(handleRequestError(req));
            };
            req.responseType = 'arraybuffer';
            req.open('GET', url);
            req.send();
        } catch (e) {
            reject(e);
        }
    });
};

export const getAudioBufferFromFile = (file: File | Blob): Promise<AudioBuffer> => {
    return new Promise((resolve, reject) => {
        try {
            if (!AudioContext) { reject(new Error('Do not support we audio api')) }
            else {
                let ctx = new AudioContext();
                let reader = new FileReader();
                reader.onload = function(e) {
                    this.result instanceof ArrayBuffer && ctx.decodeAudioData(this.result, resolve, reject);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            }
        } catch (e) {
            reject(e);
        }
    });
};

const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
};

export const getAudioBufferFromBase64 = async (base64: string): Promise<AudioBuffer> => {
    return getAudioBufferFromFile(b64toBlob(base64));
};