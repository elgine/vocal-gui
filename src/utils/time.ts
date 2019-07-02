import prefix from './prefix';

export const format = (value: number|string) => {
    let msecTime = typeof value === 'string' ? parseInt(value) : value;
    let secondTime = ~~(msecTime * 0.001);
    msecTime %= 1000;
    let minuteTime = 0;
    let hourTime = 0;
    if (secondTime >= 60) {
        minuteTime = ~~(secondTime / 60);
        secondTime = secondTime % 60;
        if (minuteTime >= 60) {
            hourTime = ~~(minuteTime / 60);
            minuteTime = minuteTime % 60;
        }
    }
    return [
        hourTime,
        minuteTime,
        secondTime,
        msecTime
    ];
};

export const toTimeString = (msec: number) => {
    const arr = format(msec);
    return `${arr[0] >= 100 ? arr[0] : prefix(2, arr[0])}:${prefix(2, arr[1])}:${prefix(2, arr[2])}.${prefix(3, arr[3])}`;
};

export const compose = (...args: number[]) => {
    return (args[0] * 3600 + args[1] * 60 + (args[2] || 0)) * 1000 + (args[3] || 0);
};