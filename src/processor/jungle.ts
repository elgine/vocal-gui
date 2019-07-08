// Copyright 2012, Google Inc.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

function createFadeBuffer(context: AudioContext, activeTime: number, fadeTime: number) {
    let length1 = activeTime * context.sampleRate;
    let length2 = (activeTime - 2 * fadeTime) * context.sampleRate;
    let length = length1 + length2;
    let buffer = context.createBuffer(1, length, context.sampleRate);
    let p = buffer.getChannelData(0);

    console.log('createFadeBuffer() length = ' + length);

    let fadeLength = fadeTime * context.sampleRate;

    let fadeIndex1 = fadeLength;
    let fadeIndex2 = length1 - fadeLength;

    // 1st part of cycle
    for (let i = 0; i < length1; ++i) {
        let value = 0;
        if (i < fadeIndex1) {
            value = Math.sqrt(i / fadeLength);
        } else if (i >= fadeIndex2) {
            value = Math.sqrt(1 - (i - fadeIndex2) / fadeLength);
        } else {
            value = 1;
        }

        p[i] = value;
    }

    // 2nd part
    for (let i = length1; i < length; ++i) {
        p[i] = 0;
    }


    return buffer;
}

function createDelayTimeBuffer(context, activeTime, fadeTime, shiftUp) {
    let length1 = activeTime * context.sampleRate;
    let length2 = (activeTime - 2 * fadeTime) * context.sampleRate;
    let length = length1 + length2;
    let buffer = context.createBuffer(1, length, context.sampleRate);
    let p = buffer.getChannelData(0);

    console.log('createDelayTimeBuffer() length = ' + length);

    // 1st part of cycle
    for (let i = 0; i < length1; ++i) {
        if (shiftUp)
        // This line does shift-up transpose
        { p[i] = (length1 - i) / length }
        else
        // This line does shift-down transpose
        { p[i] = i / length1 }
    }

    // 2nd part
    for (let i = length1; i < length; ++i) {
        p[i] = 0;
    }

    return buffer;
}

let delayTime = 0.100;
let fadeTime = 0.050;
let bufferTime = 0.100;

function Jungle(context) {
    this.context = context;
    // Create nodes for the input and output of this "module".
    let input = context.createGain();
    let output = context.createGain();
    this.input = input;
    this.output = output;

    // Delay modulation.
    let mod1 = context.createBufferSource();
    let mod2 = context.createBufferSource();
    let mod3 = context.createBufferSource();
    let mod4 = context.createBufferSource();
    this.shiftDownBuffer = createDelayTimeBuffer(context, bufferTime, fadeTime, false);
    this.shiftUpBuffer = createDelayTimeBuffer(context, bufferTime, fadeTime, true);
    mod1.buffer = this.shiftDownBuffer;
    mod2.buffer = this.shiftDownBuffer;
    mod3.buffer = this.shiftUpBuffer;
    mod4.buffer = this.shiftUpBuffer;
    mod1.loop = true;
    mod2.loop = true;
    mod3.loop = true;
    mod4.loop = true;

    // for switching between oct-up and oct-down
    let mod1Gain = context.createGain();
    let mod2Gain = context.createGain();
    let mod3Gain = context.createGain();
    mod3Gain.gain.value = 0;
    let mod4Gain = context.createGain();
    mod4Gain.gain.value = 0;

    mod1.connect(mod1Gain);
    mod2.connect(mod2Gain);
    mod3.connect(mod3Gain);
    mod4.connect(mod4Gain);

    // Delay amount for changing pitch.
    let modGain1 = context.createGain();
    let modGain2 = context.createGain();

    let delay1 = context.createDelay();
    let delay2 = context.createDelay();
    mod1Gain.connect(modGain1);
    mod2Gain.connect(modGain2);
    mod3Gain.connect(modGain1);
    mod4Gain.connect(modGain2);
    modGain1.connect(delay1.delayTime);
    modGain2.connect(delay2.delayTime);

    // Crossfading.
    let fade1 = context.createBufferSource();
    let fade2 = context.createBufferSource();
    let fadeBuffer = createFadeBuffer(context, bufferTime, fadeTime);
    fade1.buffer = fadeBuffer;
    fade2.buffer = fadeBuffer;
    fade1.loop = true;
    fade2.loop = true;

    let mix1 = context.createGain();
    let mix2 = context.createGain();
    mix1.gain.value = 0;
    mix2.gain.value = 0;

    fade1.connect(mix1.gain);
    fade2.connect(mix2.gain);

    // Connect processing graph.
    input.connect(delay1);
    input.connect(delay2);
    delay1.connect(mix1);
    delay2.connect(mix2);
    mix1.connect(output);
    mix2.connect(output);

    // Start
    let t = context.currentTime + 0.050;
    let t2 = t + bufferTime - fadeTime;
    mod1.start(t);
    mod2.start(t2);
    mod3.start(t);
    mod4.start(t2);
    fade1.start(t);
    fade2.start(t2);

    this.mod1 = mod1;
    this.mod2 = mod2;
    this.mod1Gain = mod1Gain;
    this.mod2Gain = mod2Gain;
    this.mod3Gain = mod3Gain;
    this.mod4Gain = mod4Gain;
    this.modGain1 = modGain1;
    this.modGain2 = modGain2;
    this.fade1 = fade1;
    this.fade2 = fade2;
    this.mix1 = mix1;
    this.mix2 = mix2;
    this.delay1 = delay1;
    this.delay2 = delay2;

    this.setDelay(delayTime);
}

Jungle.prototype.setDelay = function(delayTime) {
    this.modGain1.gain.setTargetAtTime(0.5 * delayTime, 0, 0.010);
    this.modGain2.gain.setTargetAtTime(0.5 * delayTime, 0, 0.010);
};

let previousPitch = -1;

Jungle.prototype.setPitchOffset = function(mult) {
    if (mult > 0) { // pitch up
        this.mod1Gain.gain.value = 0;
        this.mod2Gain.gain.value = 0;
        this.mod3Gain.gain.value = 1;
        this.mod4Gain.gain.value = 1;
    } else { // pitch down
        this.mod1Gain.gain.value = 1;
        this.mod2Gain.gain.value = 1;
        this.mod3Gain.gain.value = 0;
        this.mod4Gain.gain.value = 0;
    }
    this.setDelay(delayTime * Math.abs(mult));
    previousPitch = mult;
};
