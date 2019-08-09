import lamejs from 'lamejs';
import  { merge, eq } from 'lodash';
import float32ToInt16 from '../utils/float32ToInt16';

interface EncodeConfig{
    channels?: number;
    sampleRate?: number;
    bitRate?: number;
}

const ctx: Worker = self as any;

const CHUNK_SIZE = 1152;

let running = false;
let chunks: Int8Array[] = [];
let chunkSize = 0;
let leftChunk = new Int16Array(CHUNK_SIZE);
let rightChunk = new Int16Array(CHUNK_SIZE);
let encoder: lamejs.Mp3Encoder;
let lastConfig: {channels: number; sampleRate: number; bitRate: number};

const clearBuffer = () => {
    chunks = [];
    chunkSize = 0;
};

const isConfigEquals = (c1: EncodeConfig, c2: EncodeConfig) => eq(c1, c2);

const push = (chunk: Int8Array) => {
    const count = chunk.length;
    if (count > 0) {
        chunks.push(chunk);
        chunkSize += count;
        return count;
    }
    return 0;
};

const init = (config?: EncodeConfig) => {
    const c = merge({ channels: 1, sampleRate: 44100, bitRate: 128 }, config);
    if (!encoder || (lastConfig && (!isConfigEquals(c, lastConfig)))) {
        encoder = new lamejs.Mp3Encoder(c.channels, c.sampleRate, c.bitRate);
        lastConfig = c;
    }
    clearBuffer();
    // console.log('Init encoder');
};

const encode = (channelData: Float32Array[]) => {
    // console.log('Begin encoding');
    running = true;
    if (encoder && channelData.length > 0 && channelData[0].length > 0) {
        const len = channelData[0].length;
        const stereo = channelData.length > 1;
        let offset = 0;
        const encodeChunk = () => {
            if (offset >= len) {
                close();
                return;
            }
            for (let j = 0; j < CHUNK_SIZE; j++) {
                if (!running) return;
                leftChunk[j] = float32ToInt16(channelData[0][offset + j]);
                if (stereo) {
                    rightChunk[j] = float32ToInt16(channelData[1][offset + j]);
                }
            }
            if (!running) return;
            push(encoder.encodeBuffer(leftChunk, stereo ? rightChunk : undefined));

            offset += CHUNK_SIZE;
            ctx.postMessage({ type: 'ACTION_ENCODE_PROGRESS', payload: offset / len });
            setTimeout(encodeChunk, 10);
        };
        encodeChunk();
    }
};

const compose = (chunks: Int8Array[]) => {
    const count = chunks.length;
    if (count <= 0) return null;
    let newBuffer = new Int8Array(chunkSize);
    let offset = 0;
    chunks.forEach((chunk, i) => {
        newBuffer.set(chunk, offset);
        offset += chunk.length;
    });
    return newBuffer.buffer;
};

const close = () => {
    // console.log('Close encode');
    if (encoder) {
        push(encoder.flush());
        ctx.postMessage({ type: 'ACTION_ENCODE_SUCCESS', payload: compose(chunks) });
        clearBuffer();
    }
};

const cancel = () => {
    running = false;
    clearBuffer();
};

ctx.onmessage = (e: MessageEvent) => {
    const action = { ...e.data };
    const { type, payload } = action;
    if (type === 'encode/ACTION_ENCODE') {
        const { options, buffer } = payload;
        init(options);
        encode(buffer);
    } else if (type === 'encode/ACTION_CANCEL_ENCODE') {
        cancel();
    }
};

export default null as any;