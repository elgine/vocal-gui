import { getAudioBufferFromFile, getAudioBufferFromUrl } from './getAudioBuffer';

export const loadFromLocal = (v: Blob | File) => {
    return getAudioBufferFromFile(v);
};

export const loadFromUrl = (v: string) => {
    return getAudioBufferFromUrl(v);
};