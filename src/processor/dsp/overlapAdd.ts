import generateWin, { WindowType } from '../window';

export default class OverlapAdd {

    protected _hopA: number;
    protected _hopS: number;
    protected _inputQueue: Float32Array;
    protected _outputQueue: Float32Array;
    protected _frameSize: number;
    protected _buffer: Float32Array;
    protected _frame: Float32Array;
    protected _win: Float32Array;

    protected _inputSize: number = 0;
    protected _outputSize: number = 0;

    constructor(frameSize: number, hopA: number, hopS: number, winType: WindowType) {
        this._frameSize = frameSize;
        this._hopA = hopA;
        this._hopS = hopS;
        this._buffer = new Float32Array(this._frameSize);
        this._frame = new Float32Array(this._frameSize);
        this._win = new Float32Array(this._frameSize);
        generateWin(this._win, winType);
        this._inputQueue = new Float32Array(this._frameSize * 2);
        this._outputQueue = new Float32Array(this._frameSize * 2);
    }

    process(inBuffer: Float32Array|number[]) {
        const inBufferLen = inBuffer.length;
        this._inputQueue.set(inBuffer, this._inputSize);
        this._inputSize += inBufferLen;

        let offset = 0;
        while (this._inputSize >= offset + this._frameSize) {
            for (let i = 0; i < this._frameSize; i++) {
                this._frame[i] = this._inputQueue[offset + i] * this._win[i];
            }
            this._analyse();
            this._processing();
            this._synthesis();
            for (let i = 0; i < this._frameSize; i++) {
                this._buffer[i] += this._frame[i] * this._win[i];
            }
            this._pushToOutputQueue(this._buffer, this._hopS);
            // for (let i = 0; i < this._frameSize; i++) {
            //     if (i + this._hopS >= this._frameSize) {
            //         this._buffer[i] = 0;
            //     } else {
            //         this._buffer[i] = this._buffer[i + this._hopS];
            //     }
            // }
            this._buffer.copyWithin(0, this._hopS, this._frameSize - this._hopS);
            this._buffer.fill(0, this._frameSize - this._hopS);
            offset += this._hopA;
        }
        this._inputQueue.copyWithin(0, offset);
        this._inputSize -= offset;
    }

    pop(output: Float32Array|number[], bufferSize: number, flush: boolean = false) {
        if (this._outputSize < bufferSize && !flush) return 0;
        let popSize = Math.min(this._outputSize, bufferSize);
        for (let i = 0; i < popSize; i++) {
            output[i] = this._outputQueue[i];
        }
        this._outputQueue.copyWithin(0, popSize);
        this._outputSize -= popSize;
        return popSize;
    }

    protected _analyse() {

    }

    protected _processing() {

    }

    protected _synthesis() {

    }

    protected _pushToOutputQueue(b: ArrayLike<number>, size: number) {
        for (let i = 0; i < size; i++) {
            this._outputQueue[this._outputSize++] = b[i];
        }
    }
}