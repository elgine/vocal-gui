import { EffectType } from './effectType';
import { createEffect } from './effects/factory';
import { eq } from 'lodash';
import Effect from './effects/effect';

export enum RenderTaskLevel{
    NORMAL,
    HIGH
}

export enum RenderTaskState{
    FREE = 0,
    COMPLETE = 1,
    CANCELLED = -2,
    FAILED = -1
}

export interface RenderTask{
    source: AudioBuffer;
    level: RenderTaskLevel;
    state: RenderTaskState;
    taskCreatedTime: number;
    effectType: EffectType;
    effectOptions: any;
    segements: Segment[];
    options: OfflineAudioContextOptions;
}

class Renderer {

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

export default class RendererList {

    private _rendering: boolean = false;
    private _tasks: RenderTask[] = [];
    private _renderers: Renderer[] = [];

    addTask(task: RenderTask) {
        this._tasks.push(task);
    }

    start(id?: string) {
        if (id && this._tasks[id] && this._tasks[id].state === RenderTaskState.CANCELLED) {
            this._tasks[id].state = RenderTaskState.FREE;
            this._tasks[id].level = RenderTaskLevel.HIGH;
        }
        if (this._rendering) return;
        this._rendering = true;
        this._next();
    }

    cancel(id: string) {
        if (this._tasks[id] && this._tasks[id].state === 0) {
            this._tasks[id].state = RenderTaskState.CANCELLED;
        }
    }

    cancelAll() {
        for (let k in this._tasks) {
            if (this._tasks[k].state === RenderTaskState.FREE) {
                this._tasks[k].state = RenderTaskState.CANCELLED;
            }
        }
        this._rendering = false;
    }

    private _next() {
        const tasks = Object.values(this._tasks).filter((t) => t.state === RenderTaskState.FREE).sort((a: RenderTask, b: RenderTask) => {
            if (a.level === b.level) return a.taskCreatedTime - b.taskCreatedTime;
            return b.level - a.level;
        });
        this._render(tasks[0]);
    }

    private* _render(task: RenderTask) {
        while (true) {
            const freeRenderers = this._renderers.filter((renderer) => !renderer.rendering);
            const freeTasks = this._tasks.filter((task) => task.state === RenderTaskState.FREE);
            if (freeTasks.length <= 0) {

            }
            yield;
        }
    }

    get rendering() {
        return this._rendering;
    }
}