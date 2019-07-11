import Recorder from '../src/processor/recorder';

window.onload = function() {
    const startBtn = document.createElement('button');
    startBtn.innerText = 'Start record';
    startBtn.addEventListener('click', () => {
        const recorder = new Recorder();
        recorder.start((v: Float32Array) => {
            console.log(v);
        });
    });
    document.body.appendChild(startBtn);
};