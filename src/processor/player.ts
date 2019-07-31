import { clamp } from 'lodash';
import { EffectType } from './effectType';
import { createEffect, getDelayApplyEffect, getDurationApplyEffect } from './effects/factory';
import Effect from './effects/effect';
import Emitter from '../utils/emitter';
import Ticker from '../utils/ticker';

export default class Player extends Emitter {

    static ON_BUFFERING = 'ON_BUFFERING';
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
    private _buffering: boolean = false;
    private _actualTime: number= 0;
    private _suspendTime: number = 0;
    private _region: number[] = [];

    constructor() {
        super();
        this._ticker.timeGetter = this._getTime.bind(this);
        this._ticker.onTick.on(this._onTick.bind(this));
    }

    async setEffect(effectType: EffectType, initialState?: any) {
        if (this._effectType === effectType) return;
        this._effectType = effectType;
        if (this._playing) {
            this.stop();
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
        if (this._actualTime === time) return;
        this._ticker.rt = this._actualTime = time;
        if (this._playing) {
            this.stop();
            this.play();
        }
    }

    async play() {
        if (!this._inputBuffer || this._playing) return;
        this._suspendTime = this._ticker.rt;
        this._playing = true;
        this._buffering = false;
        this._init();
        this._initInput();
        await this._updateEffect();
        this._updateGraph();
        this._ticker.run();
        this._input!.start(0, this._actualTime * 0.001);
    }

    stop() {
        this._playing = false;
        if (this._effect) {
            this._effect.output.disconnect();
        }
        this._disposeInput();
        this._ticker.stop();
    }

    private _getTime() {
        return Math.max(0, (this._audioCtx.currentTime - this._audioCtx.baseLatency)) * 1000;
    }

    private _calcActualTime(v: number) {
        this._actualTime = v;
        if (this._effect) {
            let duration = this._inputBuffer.duration;
            let delay = getDelayApplyEffect(this._effectType, this._effectState, duration) * 1000;
            let timeScale = getDurationApplyEffect(this._effectType, this._effectState, duration) / duration;
            if (v - this._suspendTime < delay) {
                if (!this._buffering) {
                    this._buffering = true;
                    this.emit(Player.ON_BUFFERING, this._buffering);
                }
                this._actualTime = v - Math.min(v - this._suspendTime, delay);
            } else {
                this._actualTime = (v - this._region[0] - delay) / timeScale + this._region[0];
            }
        }
        if (this._buffering) {
            this._buffering = false;
            this.emit(Player.ON_BUFFERING, this._buffering);
        }
        return this._actualTime;
    }

    private _onTick() {
        if (!this._playing) return;
        const s = this._region[0] || 0;
        const e = this._region[1] || 0;
        this._calcActualTime(this._ticker.rt);
        if (this._actualTime >= e) {
            if (this._loop) {
                this.seek(s);
            } else {
                this.seek(e);
                this.stop();
                this.emit(Player.ON_ENDED, this._actualTime);
                return;
            }
        }
        this.emit(Player.ON_TICK, this._actualTime);
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
            this._effect.clear();
            this._effect.setSourceDuration(this._inputBuffer.duration);
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