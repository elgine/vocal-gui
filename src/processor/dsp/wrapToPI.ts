export default (rad: number) => {
    let a = rad + Math.PI;
    let b = -2 * Math.PI;
    return (a - ~~(a / b) * b + Math.PI);
};