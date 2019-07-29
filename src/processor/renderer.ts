import { EffectType } from './effectType';
import { createEffect } from './effects/factory';
import { eq } from 'lodash';
import Effect from './effects/effect';

export enum RenderTaskLevel{
    NORMAL,
    HIGH
}

export enum RenderTaskState{
    WAITING = 0,
    COMPLETE = 1,
    STOPPED = -2,
    FAILED = -1
}

export interface RenderTask{
    id: string;
    title: string;
    source?: AudioBuffer;
    level: RenderTaskLevel;
    state: RenderTaskState;
    taskCreatedTime: number;
    effectType: EffectType;
    effectOptions: any;
    segments: Segment[];
    options: OfflineAudioContextOptions;
}

export default class Renderer {

    private _offlineAudioCtx!: OfflineAudioContext;
    private _lastOptions!: OfflineAudioContextOptions;
    private _effect!: Effect;
    private _rendering: boolean = false;

    * render(task: RenderTask) {
        this._rendering = true;
        if (!this._offlineAudioCtx || !eq(this._lastOptions, task.options)) {
            this._offlineAudioCtx = new OfflineAudioContext(task.options);
            this._lastOptions = task.options;
        }
        yield this._buildGraph(task);
        let buffer = yield this._offlineAudioCtx.startRendering();
        this._rendering = false;
        return buffer;
    }

    * stop() {
        yield this._offlineAudioCtx.suspend(this._offlineAudioCtx.currentTime);
        this._rendering = false;
    }

    * resume() {
        yield this._offlineAudioCtx.resume();
        this._rendering = true;
    }

    private* _buildGraph(task: RenderTask) {
        if (!task.source) return;
        if (!this._effect || this._effect.type !== task.effectType) {
            let e = yield createEffect(task.effectType, this._offlineAudioCtx);
            if (!e) {
                throw new Error(`No specific effect, ${task.effectType}`);
            }
            this._effect = e;
        }
        this._effect.set(task.effectOptions);
        let input = this._offlineAudioCtx.createBufferSource();
        input.buffer = task.source;
        input.connect(this._effect.input);
        this._effect.output.connect(this._offlineAudioCtx.destination);
    }

    get rendering() {
        return this._rendering;
    }
}