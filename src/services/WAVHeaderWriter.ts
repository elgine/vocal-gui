const WAV_HEAD_SIZE = 44;

const writeUTFBytes = (view: DataView, offset: number, str: string) => {
    const len = str.length;
    for (let i = 0; i < len; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
};

const interleave = (audioBuffer: AudioBuffer) => {
    let channels = audioBuffer.numberOfChannels;
    let size = audioBuffer.length;
    let total = size * channels;
    let data = new Float32Array(total);
    for (let i = 0; i < size; i++) {
        let k = i * channels;
        for (let j = 0; j < channels; j++) {
            data[k + j] = audioBuffer.getChannelData(i)[j];
        }
    }
    return data;
};

export default (audioBuffer: AudioBuffer) => {
    const { numberOfChannels, length, sampleRate } = audioBuffer;
    const dataLength = length * numberOfChannels;
    let buffer = new ArrayBuffer(dataLength + WAV_HEAD_SIZE);
    let view = new DataView(buffer);
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + dataLength, true);
    writeUTFBytes(view, 8, 'WAVE');
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 2, true);
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    const interleaved = interleave(audioBuffer);

    let index = WAV_HEAD_SIZE;
    for (let i = 0; i < length; i++) {
        view.setInt16(index, interleaved[i] * 0x7FFF, true);
        index += 2;
    }

    return buffer;
};