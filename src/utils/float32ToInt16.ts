import { clamp } from 'lodash';

export default (v: number) => {
    let sample = clamp(v, -1, 1);
    sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
    return sample;
};