import calcMaxFactor from '../../utils/calcMaxFactor';

export default (timeUnit: number) => {
    timeUnit = ~~Math.round(timeUnit / 1000) * 1000;
    let division: number[] = [];
    let str = String(timeUnit);
    let strRemoved = str.replace(/0*$/g, '');
    let zeroLen = str.length - strRemoved.length;
    const getNum = (v: number) => (v * Math.pow(10, zeroLen));
    let newVal = Number(strRemoved);
    if (newVal === 1) {
        return [
            getNum(1),
            getNum(0.5),
            getNum(0.1)
        ];
    }
    division.push(getNum(newVal));
    let f1 = calcMaxFactor(newVal);
    division.push(getNum(f1));
    let f2 = calcMaxFactor(f1);
    division.push((f1 === 1 || f2 === 1 || f2 === f1) ? getNum(f1 * 0.5) : getNum(f2));
    return division;
};