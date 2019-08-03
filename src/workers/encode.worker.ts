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
};

const encode = (channelData: Float32Array[]) => {
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
                ctx.postMessage({
                    type: 'ACTION_ENCODE_ERROR',
                    payload: 'Can not encode buffer to mp3 frame'
                });
            }
        }
    }
};

const close = () => {
    if (encoder) {
        const chunk = encoder.flush();
        if (chunk.length > 0) { chunks.push(chunk) }
        ctx.postMessage({ type: 'ACTION_ENCODE_SUCCESS', payload: chunks });
        clearBuffer();
    }
};

ctx.addEventListener('message', (e) => {
    const action = e.data;
    if (!action.type) return;
    const { type, payload } = action;
    if (type.toLowerCase() === 'encode/ACTION_ENCODE') {
        const { options, buffer } = payload;
        init(options);
        encode(buffer);
        close();
    }
    // switch (type.toLowerCase()) {
    //     case 'encode/ACTION_ENCODE_INIT': {
    //         init(payload);
    //         break;
    //     }
    //     case 'encode/ACTION_ENCODE': {
    //         encode(payload);
    //         break;
    //     }
    //     case 'encode/ACTION_ENCODE_CLOSE': {
    //         close();
    //     }
    // }
});