import Recorder from './recorder';
import Player from './player';
import Renderer from './renderer';

let recorder: Recorder;
let player: Player;
let renderer: Renderer;

export const getRecorder = (...args: any[]) => {
    if (!recorder) {
        recorder = new Recorder(...args);
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