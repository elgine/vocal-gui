export { default as EN } from './EN';
export { default as CN } from './CN';

import EN from './EN';
import CN from './CN';

export enum Lang{
    EN,
    CN
}

export const getDesc = (key: string, lang: Lang) => {
    if (lang === Lang.EN) return EN[key];
    else if (lang === Lang.CN) return CN[key];
};