import OverlapAdd from './overlapAdd';

export interface PhaseVocoderOptions{
    pitch: number;
    tempo: number;
}

export default class PhaseVocoder extends OverlapAdd {

    protected _shiftWindow(data: Float32Array|number[]) {
        const len = data.length;
        const halfLen = len / 2;
        if (len % 2 === 0) {
            for (let i = 0; i < halfLen; i++) {
                let tmp = data[i];
                data[i] = data[i + halfLen];
                data[i + halfLen] = tmp;
            }
        } else {
            let shiftAmt = halfLen;
            let remaining = len;
            let curr = 0;
            let save = data[curr];
            while (remaining >= 0) {
                let next = data[(curr + shiftAmt) % len];
                data[(curr + shiftAmt) % len] = save;
                save = next;
                curr = (curr + shiftAmt) % len;
                remaining--;
            }
        }
    }
}