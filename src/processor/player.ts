import { clamp } from 'lodash';
import { EffectType } from './effectType';
import { createEffect } from './effects/factory';
import Effect from './effects/effect';
import Ticker from '../utils/ticker';
import Emitter from '../utils/emitter';

export default class Player extends Emitter {

    static ON_TICK = 'ON_TICK';
    static ON_ENDED = 'ON_ENDED';

    private _audioCtx!: AudioContext;
    private _ticker: Ticker = new Ticker();
    private _effectType: EffectType = EffectType.NONE;
    private _effectState: any = {};
    private _effect: Effect|null = null;
    private _input: AudioBufferSourceNode|null = null;
    private _inputBuffer!: AudioBuffer;
    private _gain!: GainNode;
    private _volume: number = 1;
    private _playing: boolean = false;
    private _loop: boolean = false;
    private _region: number[] = [];

    constructor() {
        super();
        this._onEnded = this._onEnded.bind(this);
        this._ticker.timeGetter = () => {
            return Math.max(0, (this._audioCtx.currentTime - this._audioCtx.baseLatency)) * 1000;
        };
        this._ticker.cb = this._onTick.bind(this);
    }

    async setEffect(effectType: EffectType, initialState?: any) {
        if (this._effectType === effectType) return;
        this._effectType = effectType;
        if (this._playing && this._audioCtx) {
            this.stop();
            await this._updateEffect();
            this.play();
        }
        initialState && this.setEffectState(initialState);
    }

    setRegion(r: number[]) {
        this._region = r;
    }

    setRepeat(v: boolean) {
        this._loop = v;
    }

    setVolume(v: number) {
        this._volume = clamp(v, 0, 1);
        if (this._gain) {
            this._gain.gain.value = this._volume;
        }
    }

    setEffectState(state: any) {
        this._effectState = state;
        if (this._effect) {
            this._effect.set(state);
        }
    }

    setSource(source: AudioBuffer) {
        this.stop();
        this._inputBuffer = source;
    }

    seek(time: number) {
        if (this._ticker.t === time) return;
        this._ticker.t = time;
        if (this._playing) {
            this._initInput();
            this._updateGraph();
            this._input!.start(0, this._ticker.t * 0.001);
        }
    }

    async play(time?: number) {
        if (!this._inputBuffer) return;
        this._playing = true;
        this._init();
        this._initInput();
        await this._updateEffect();
        this._updateGraph();
        if (time) this._ticker.t = time;
        this._ticker.run();
        this._input!.start(0, this._ticker.t * 0.001);
    }

    stop() {
        this._playing = false;
        if (this._effect) {
            this._effect.output.disconnect();
        }
        this._disposeInput();
        this._ticker.stop();
    }

    private _onEnded() {
        if (this._loop) {
            this.seek(this._region[0] || 0);
        } else {
            this.stop();
            this.emit(Player.ON_ENDED, this._ticker.t);
        }
    }

    private _onTick() {
        const s = this._region[0] || 0;
        const e = this._region[1] || 0;
        if (this._ticker.t < s) {
            this.seek(s);
        }
        if (this._ticker.t >= e) {
            if (this._loop) {
                this.seek(s);
            } else {
                this.seek(e);
                this.stop();
                this.emit(Player.ON_ENDED, this._ticker.t);
                return;
            }
        }
        this.emit(Player.ON_TICK, this._ticker.t);
    }

    private _disposeInput() {
        if (this._input) {
            this._input.stop();
            this._input.disconnect();
            this._input.onended = null;
            this._input = null;
        }
    }

    private _initInput() {
        this._disposeInput();
        this._input = this._audioCtx.createBufferSource();
        this._input.buffer = this._inputBuffer;
        // this._input.onended = this._onEnded;
    }

    private async _updateEffect() {
        if (this._effect && this._effect.type !== this._effectType || (
            !this._effect && this._effectType !== EffectType.NONE
        )) {
            if (this._effect) {
                this._effect.dispose();
                this._effect.output.disconnect();
            }
            this._effect = await createEffect(this._effectType, this._audioCtx);
        }
        if (this._effect) {
            this._effect.set(this._effectState);
        }
    }

    private _updateGraph() {
        if (!this._input) return;
        if (this._effect) {
            this._input.connect(this._effect.input);
            this._effect.output.connect(this._gain);
        } else {
            this._input.connect(this._gain);
        }
    }

    private _init() {
        if (this._audioCtx) return;
        this._audioCtx = this._audioCtx || new AudioContext();
        if (!this._audioCtx) {
            throw new Error('Can not initialize AudioContext, please upgrade your browser to support');
        }
        if (!this._gain) {
            this._gain = this._audioCtx.createGain();
            this._gain.connect(this._audioCtx.destination);
        }
        this._gain.gain.value = this._volume;
    }
}