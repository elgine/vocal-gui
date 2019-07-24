import Recorder from './recorder';
import Player from './player';
import Renderer from './renderer';

let recorder: Recorder;
let player: Player;
let renderer: Renderer;

export const getRecorder = () => {
    if (!recorder) {
        recorder = new Recorder();
    }
    return recorder;
};

export const getPlayer = () => {
    if (!player) {
        player = new Player();
    }
    return player;
};