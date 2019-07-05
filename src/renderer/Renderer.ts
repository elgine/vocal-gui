import { Effect } from '../presets/effects';

export interface RenderTask{
    source: string;
    dest: string;
    effectId: Effect;
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

    addTask() {

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

    }

    get rendering() {
        return this._rendering;
    }
}