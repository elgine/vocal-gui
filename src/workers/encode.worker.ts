import lamejs from 'lamejs';
import  { merge } from 'lodash';

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

const clearBuffer = ()=>{
    chunks.length = 0;
};

const isConfigEquals = (c1: EncodeConfig, c2: EncodeConfig) => {
    return c1.channels === c2.channels && c1.bitRate === c2.bitRate && c1.sampleRate === c2.sampleRate;
};

const init = (config?: EncodeConfig) => {
    const c = merge({ channels: 1, sampleRate: 44100, bitRate: 128 }, config);
    if (!encoder || (lastConfig && (!isConfigEquals(c, lastConfig)))) {
        encoder = new lamejs.Mp3Encoder(c.channels, c.sampleRate, c.bitRate);
        clearBuffer();
    }
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
                    type: 'encode/ACTION_ENCODE_ERROR',
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
        ctx.postMessage({ type: 'encode/ACTION_ENCODE_SUCCESS', payload: chunks });
        clearBuffer();
    }
};

ctx.addEventListener('message', (e) => {
    if(!e.data.type)return;
    switch (e.data.type.toLowerCase()) {
        case 'init': {
            init(e.data.data);
            break;
        }
        case 'encode': {
            encode(e.data.data);
            break;
        }
        case 'close': {
            close();
        }
    }
});