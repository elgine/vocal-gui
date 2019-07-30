import Ticker from '../utils/ticker';

export default class CorrectTicker extends Ticker {

    scale: number = 1;
    lantency: number = 0;

    private _t: number = 0;
    private _passed: number = 0;

    constructor() {
        super();
        this.onTick.on(this._onTick.bind(this));
    }

    reset() {
        this._passed = 0;
    }

    private _onTick(ticker: CorrectTicker) {
        this._passed += ticker.dt;
        if (this._passed > this.lantency) {
            this._t += ticker.dt / this.scale;
        }
    }

    get t() {
        return this._t;
    }
}