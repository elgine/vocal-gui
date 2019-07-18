import { EffectType } from './effectType';
import { createEffect } from './effects/factory';

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
    source: string;
    dest: string;
    level: RenderTaskLevel;
    state: RenderTaskState;
    taskCreatedTime: number;
    effectType: EffectType;
    effectOptions: any;
    segements: Segment[];
}

export default class Renderer {

    public readonly offlineAudioCtx: OfflineAudioContext;
    public readonly options: OfflineAudioContextOptions;
    private _rendering: boolean = false;
    private _tasks: Dictionary<RenderTask> = {};

    constructor(options: OfflineAudioContextOptions) {
        this.options = options;
        this.offlineAudioCtx = new OfflineAudioContext(options);
        if (!this.offlineAudioCtx) {
            throw new Error('Can not initialize OfflineAudioContext, please upgrade your browser to support');
        }
    }

    addTask(task: RenderTask) {
        if (this._tasks[task.source] !== undefined) return;
        this._tasks[task.source] = task;
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

    private _render(task: RenderTask) {
        createEffect(task.effectType, this.offlineAudioCtx);
    }

    get rendering() {
        return this._rendering;
    }
}