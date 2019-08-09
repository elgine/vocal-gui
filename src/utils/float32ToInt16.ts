import { clamp } from 'lodash';

export default (v: number) => {
    return clamp(v, -1, 1) * 0x7FFF;
};