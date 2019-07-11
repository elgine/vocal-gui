import { EffectType } from './effectType';

export interface RenderTask{
    source: string;
    dest: string;
    effectType: EffectType;
    effectOptions: any;
    segements: Segment[];
}

export default class Renderer {

    public readonly offlineAudioCtx: OfflineAudioContext;
    private _rendering: boolean = false;
    private _tasks: RenderTask[] = [];
    private _taskIndex: number = -1;

    constructor(options: OfflineAudioContextOptions) {
        this.offlineAudioCtx = new OfflineAudioContext(options);
        if (!this.offlineAudioCtx) {
            throw new Error('Can not initialize OfflineAudioContext, please upgrade your browser to support');
        }
    }

    addTask(task: RenderTask) {
        this._tasks.push(task);
    }

    start() {
        this._rendering = true;
        this._next();
    }

    stop(id: string) {
        this._rendering = false;
    }

    stopAll() {

    }

    cancel(id: string) {

    }

    cancelAll() {

    }

    private _next() {
        const task = this._tasks[++this._taskIndex];
        this._buildGraph(task);
    }

    private _buildGraph(task: RenderTask) {

    }

    get rendering() {
        return this._rendering;
    }
}