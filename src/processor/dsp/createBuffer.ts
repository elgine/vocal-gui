export const buildCurve = (sampleRate: number = 44100, gain: number = 0.5) => {
    gain = gain * 100;
    let curveLength = sampleRate;
    let curve = new Float32Array(curveLength);
    let deg = Math.PI / 180;
    for (let i = 0; i < sampleRate; ++i) {
        let x = i * 2.0 / sampleRate - 1.0;
        curve[i] = (3 + gain) * x * 20 * deg / (Math.PI + gain * Math.abs(x));
    }
    return curve;
};

export function createFadeBuffer(context: BaseAudioContext, activeTime: number, fadeTime: number) {
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

export function createDelayTimeBuffer(context: BaseAudioContext, activeTime: number, fadeTime: number, shiftUp: boolean) {
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