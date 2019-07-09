export enum WindowType {
    HANNING,
    HAMMING,
    RECTANGLE,
    BARTLETT,
    BLACKMAN,
    KAISER
}

/**
* Calculates rectangle window coefficients.
*/
const rectangle = (win: Float32Array|number[], amp: number) => {
    for (let i = 0, N = win.length; i < (N + 1) / 2; ++i) {
        win[i] = amp;
        win[N - 1 - i] = win[i];
    }
};

/**
* Calculates bartlett window coefficients.
*/
const bartlett = (win: Float32Array|number[], amp: number) => {
    for (let i = 0, N = win.length; i < (N + 1) / 2; ++i) {
        win[i] = amp * 2 * i / (N - 1);
        win[N - 1 - i] = win[i];
    }
};

/**
* Calculates hanning window coefficients.
*/
const hanning = (win: Float32Array|number[]) => {
    for (let i = 0, N = win.length; i < N; ++i) {
        win[i] = 0.5 - 0.5 * Math.cos(Math.PI * 2 * i / N);
    }
};

/**
* Calculates hamming window coefficients.
*/
const hamming = (win: Float32Array|number[]) => {
    for (let i = 0, N = win.length; i < N; ++i) {
        win[i] = 0.54 - 0.46 * Math.cos(Math.PI * 2 * i / (N - 1.0));
    }
};

/**
* Calculates hamming window coefficients.
*/
const blackman = (win: Float32Array| number[], amp: number) => {
    for (let i = 0, N = win.length; i < (N + 1) / 2; ++i) {
        win[i] = amp * (0.42 - 0.50 * Math.cos(Math.PI * 2 * i / (N - 1.0))
            + 0.08 * Math.cos(2 * Math.PI * 2 * i / (N - 1.0)));
        win[N - 1 - i] = win[i];
    }
};

const besselI0 = (x: number) => {
    let denominator;
    let numerator;
    let z;
    if (x === 0.0) {
        return 1.0;
    }
    else {
        z = x * x;
        numerator = (z * (z * (z * (z * (z * (z * (z * (z * (z * (z * (z * (z * (z *
            (z * 0.210580722890567e-22 + 0.380715242345326e-19) +
            0.479440257548300e-16) + 0.435125971262668e-13) +
            0.300931127112960e-10) + 0.160224679395361e-7) +
            0.654858370096785e-5) + 0.202591084143397e-2) +
            0.463076284721000e0) + 0.754337328948189e2) +
            0.830792541809429e4) + 0.571661130563785e6) +
            0.216415572361227e8) + 0.356644482244025e9) +
            0.144048298227235e10);
        denominator = (z * (z * (z - 0.307646912682801e4) +
            0.347626332405882e7) - 0.144048298227235e10);
    }
    return -numerator / denominator;
};

/**
* Calculates kasier window coefficients.
*/
const kaiser = (win: Float32Array|number[], beta: number) => {
    for (let i = 0, N = win.length; i <= N; i++) {
        win[i] = besselI0(beta * Math.sqrt(1.0 - Math.pow((i - N * 0.5) / (N * 0.5), 2.0))) / besselI0(beta);
    }
};


export default (output: Float32Array|number[], type: WindowType, extra = 1.0) => {
    switch (type) {
        case WindowType.HANNING:
            hanning(output);
            break;
        case WindowType.BARTLETT:
            bartlett(output, extra);
            break;
        case WindowType.BLACKMAN:
            blackman(output, extra);
            break;
        case WindowType.KAISER:
            kaiser(output, extra);
            break;
        default:
            hamming(output);
            break;
    }
};