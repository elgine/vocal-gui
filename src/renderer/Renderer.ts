
export default class Renderer {

    public readonly offlineAudioCtx: OfflineAudioContext;

    private _rendering: boolean = false;

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

    }

    stopAll() {

    }

    cancel(id: string) {

    }

    cancelAll() {

    }

    private _next() {

    }
}