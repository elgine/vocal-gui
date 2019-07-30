export default (input: Float32Array|number[], inputLen: number, outputLen: number, ratio: number, output: Float32Array|number[]) => {
    for (let i = 0; i < outputLen; ++i) {
        let j = i / ratio;
        let j1 = Math.floor(j);
        let j2 = Math.ceil(j);
        if (j1 >= inputLen) {
            j1 = inputLen - 1;
        }
        if (j2 >= inputLen) {
            j2 = inputLen - 1;
        }

        if (j1 < 0)j1 = 0;
        if (j2 < 0)j2 = 0;

        let w = j - j1;
        output[i] = input[j1] * w + input[j2] * (1 - w);
    }
    return outputLen;
};