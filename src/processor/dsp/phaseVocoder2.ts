import fft from './fft';

// Phase vocoder algorithm.
// Inspired by guitar pitch shifter, http://www.guitarpitchshifter.com/algorithm.html
// Usage: constructor -> initialize -> process
export default class PhaseVocoder {

    private _frameSize: number = 1024;
    private _overlapFactor: number = 0.25;

    private _real: Float32Array;
    private _imag: Float32Array;
    private _window: Float32Array;
    private _omega: Float32Array;
    private _prevInPhase: Float32Array;
    private _prevOutPhase: Float32Array;
    private _dstBuffer: number[] = [];
    private _output: number[];

    private _hs = 256;
    private _ha = 256;
    private _ht = 256;

    constructor(fftSize: number, overlap: number = 0.25) {
        this._frameSize = fftSize || 1024;
        this._overlapFactor = overlap || 0.25;
        this._hs = this._ht = this._ha = Math.round(this._frameSize * this._overlapFactor);
        this._real = new Float32Array(this._frameSize);
        this._imag = new Float32Array(this._frameSize);
        this._window = new Float32Array(this._frameSize);
        this._omega = new Float32Array(this._frameSize);
        this._prevInPhase = new Float32Array(this._frameSize);
        this._prevOutPhase = new Float32Array(this._frameSize);
        this._output = new Array<number>(this._frameSize);

        for (let i = 0; i < this._frameSize; i++) {
            this._window[i] = (0.5 * (1.0 - Math.cos((2.0 * Math.PI * (i)) / this._frameSize)));
            this._omega[i] = (Math.PI * 2 * this._ha * i / this._frameSize);
            this._output[i] = 0.0;
            this._prevOutPhase[i] = 0.0;
        }
    }

    process(frame: Float32Array) {
        let output: number[];
        let timeStretched = this.processFrame(this._getStretcher(), frame);
        const pitchFactor = this._getPitchStretchFactor();
        if (pitchFactor !== 1.0) {
            output = this._resample(timeStretched, this._ht, 1.0000 / pitchFactor);
        } else {
            output = timeStretched;
        }
        Array.prototype.push.apply(this._dstBuffer, output);
    }

    pop(buffer: Float32Array, size: number) {
        if (this._dstBuffer.length < size) return 0;
        for (let i = 0; i < size; i++) {
            buffer[i] = this._dstBuffer[i];
        }
        this._dstBuffer.splice(0, size);
        return size;
    }

    processFrame(stretchFactor: number, buffer: Float32Array) {
        const hopSize = Math.round(stretchFactor * this._ha);
        let frame = new Float32Array(this._frameSize);
        for (let i = 0; i < this._frameSize; i++) {
            frame[i] = buffer[i];
        }
        frame = this._pvStep(stretchFactor, frame);
        let finishedBytes = this._overlap(hopSize, frame);
        const len = finishedBytes.length;
        let finalOutput = new Array<number>(len);
        const overlapScaling = this._frameSize / (hopSize * 2.0);
        for (let i = 0; i < len; i++) {
            finalOutput[i] = (finishedBytes.shift() as number) / overlapScaling;
        }
        return finalOutput;
    }

    /**
     * Resample, simple linear interpolation method
     * @param src
     * @param n
     * @param scalar
     * @returns {Array}
     * @private
     */
    private _resample(src: Float32Array|number[], n: number, scalar: number) {
        const srcLength = src.length;
        let dst: number[] = [];
        for (let i = 0; i < n; ++i) {
            let j = i / scalar;
            let j1 = Math.floor(j);
            let j2 = Math.ceil(j);
            if (j1 >= srcLength) {
                j1 = j1 = srcLength - 1;
            }
            if (j2 >= srcLength) {
                j2 = j2 = srcLength - 1;
            }

            if (j1 < 0)j1 = 0;
            if (j2 < 0)j2 = 0;

            let w = j - j1;
            dst[i] = src[j1] * w + src[j2] * (1 - w);
        }
        return dst;
    }

    private _pvStep(stretchFactor: number, frame: Float32Array) {
        // Do windowing
        for (let i = 0; i < this._frameSize; i++) {
            frame[i] = frame[i] * this._window[i];
        }

        // Shift frame after windowing ensure the window not at the left-most position.
        frame = this._shiftWindow(frame);

        // Do Fft forward translation
        this._real.set(frame);
        this._imag.fill(0);
        fft(this._real, this._imag, 1);

        // Calculate newPhase (including )
        for (let i = 0; i < this._frameSize; i++) {
            let magn = this._getMagnitude(this._real[i], this._imag[i]);
            let phase = this._getPhase(this._real[i], this._imag[i]);
            let diff = phase - this._prevInPhase[i] - this._omega[i];
            let freqDiff = this._omega[i] + this._mapPhaseIntoInterval(diff);
            let newPhase = this._mapPhaseIntoInterval(this._prevOutPhase[i] + freqDiff * stretchFactor);
            this._prevOutPhase[i] = newPhase;
            this._prevInPhase[i] = phase;

            this._real[i] = Math.cos(newPhase) * magn;
            this._imag[i] = Math.sin(newPhase) * magn;
        }

        fft(this._real, this._imag, -1);
        frame.set(this._real);

        frame = this._shiftWindow(frame);
        for (let i = 0; i < frame.length; i++) {
            frame[i] = frame[i] * this._window[i];
        }
        return frame;
    }

    private _overlap(hopSize: number, frame: Float32Array) {
        const frameLength = frame.length;
        let finishedBytes: number[] = [];
        for (let i = 0; i < hopSize; i++) {
            finishedBytes.push(this._output.shift() as number);
            this._output.push(0.0);
        }

        for (let i = 0; i < frameLength; i++) {
            this._output[i] += frame[i];
        }
        return finishedBytes;
    }

    private _getMagnitude(real: number, imag: number) {
        return Math.sqrt(Math.pow(real, 2) + Math.pow(imag, 2));
    }

    private _getPhase(real: number, imag: number) {
        return Math.atan2(imag, real);
    }

    private _shiftWindow(data: Float32Array) {
        let len = data.length;
        let halfLen = len / 2;
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
        return data;
    }

    private _mapPhaseIntoInterval(phase) {
        return (phase + Math.PI) % (-Math.PI * 2) + Math.PI;
    }

    private _getPitchStretchFactor() {
        return this._hs / this._ht;
    }

    private _getStretcher() {
        return this._hs / this._ha;
    }

    set pitch(p: number) {
        this._hs = Math.round(p * this._ht);
    }

    set tempo(t: number) {
        const pitchStretch = this._getPitchStretchFactor();
        this._ht = Math.round(this._ha * t);
        this._hs = Math.round(pitchStretch * this._ht);
    }

    get ha() {
        return this._ha;
    }

    get hs() {
        return this._ht;
    }
}