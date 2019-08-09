export default (blob: Blob | File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(e) {
            resolve(this.result as ArrayBuffer);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
};