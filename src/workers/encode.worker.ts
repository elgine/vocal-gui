import lamejs from 'lamejs';
import  { merge, eq } from 'lodash';

interface EncodeConfig{
    channels?: number;
    sampleRate?: number;
    bitRate?: number;
}

const ctx: Worker = self as any;

const CHUNK_SIZE = 1152;

let chunks: Int8Array[] = [];
let leftChunk = new Float32Array(CHUNK_SIZE);
let rightChunk = new Float32Array(CHUNK_SIZE);
let encoder: lamejs.Mp3Encoder;
let lastConfig: {channels: number; sampleRate};

const clearBuffer = () => {
    chunks = [];
};

const isConfigEquals = (c1: EncodeConfig, c2: EncodeConfig) => eq(c1, c2);

const init = (config?: EncodeConfig) => {
    const c = merge({ channels: 1, sampleRate: 44100, bitRate: 128 }, config);
    if (!encoder || (lastConfig && (!isConfigEquals(c, lastConfig)))) {
        encoder = new lamejs.Mp3Encoder(c.channels, c.sampleRate, c.bitRate);
    }
    clearBuffer();
    console.log('Init encoder');
};

const encode = (channelData: Float32Array[]) => {
    console.log('Begin encoding');
    if (encoder && channelData.length > 0 && channelData[0].length > 0) {
        const len = channelData[0].length;
        const stereo = channelData.length > 1;
        for (let i = 0; i < len; i += CHUNK_SIZE) {
            for (let j = 0; j < CHUNK_SIZE; j++) {
                leftChunk[j] = channelData[0][i + j];
                if (stereo) {
                    rightChunk[j] = channelData[1][i + j];
                }
            }
            const chunk = encoder.encodeBuffer(leftChunk, stereo ? rightChunk : undefined);
            if (chunk.length > 0) {
                chunks.push(chunk);
            } else {
                console.log('Occur encode error');
                ctx.postMessage({
                    type: 'ACTION_ENCODE_ERROR',
                    payload: 'Can not encode buffer to mp3 frame'
                });
            }
        }
    }
};

const compose = (chunks: Int8Array[]) => {
    const count = chunks.length;
    if (count <= 0) return null;
    const chunkSize = chunks[0].length;
    const total = count * chunkSize;
    let newBuffer = new Int8Array(total);
    chunks.forEach((chunk, i) => {
        newBuffer.set(chunk, i * chunkSize);
    });
    return newBuffer.buffer;
};

const close = () => {
    console.log('Close encode');
    if (encoder) {
        const chunk = encoder.flush();
        if (chunk.length > 0) { chunks.push(chunk) }
        ctx.postMessage({ type: 'ACTION_ENCODE_SUCCESS', payload: chunks });
        clearBuffer();
    }
};

ctx.onmessage = (e: MessageEvent) => {
    const action = { ...e.data };
    const { type, payload } = action;
    if (type === 'encode/ACTION_ENCODE') {
        const { options, buffer } = payload;
        init(options);
        encode(buffer);
        close();
    }
};

export default null as any;