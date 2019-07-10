export const calculateMagnitude = (real: number, imag: number) => {
    return Math.sqrt(Math.pow(real, 2.0) + Math.pow(imag, 2.0));
};

export const calculatePhase = (real: number, imag: number) => {
    return Math.atan2(imag, real);
};