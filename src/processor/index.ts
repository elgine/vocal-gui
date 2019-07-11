import Recorder from './recorder';
import Player from './player';
import Renderer from './renderer';

let recorder: Recorder;
let player: Player;
let renderer: Renderer;
/**
 * `onaudioprocess` will be triggered when ScriptProcessor's buffer is capcable.
 * If too small, GC will trigger frequently, because of `onaudioprocess` event
 */
const SAFE_BUFFER_SIZE = 2048;

export const getRecorder = () => {
    if (!recorder) {
        recorder = new Recorder(SAFE_BUFFER_SIZE);
    }
    return recorder;
};

export const getPlayer = () => {
    if (!player) {
        player = new Player();
    }
    return player;
};

export const getRenderer = (options: OfflineAudioContextOptions) => {
    if (!renderer) {
        renderer = new Renderer(options);
    }
    return renderer;
};