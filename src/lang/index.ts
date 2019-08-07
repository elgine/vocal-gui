import React from 'react';

export { default as EN } from './EN';
export { default as CN } from './CN';

import EN from './EN';
import CN from './CN';

export enum Lang{
    EN,
    CN
}

export const languages = [
    {
        label: 'LANGUAGE_EN',
        value: Lang.EN
    },
    {
        label: 'LANGUAGE_CN',
        value: Lang.CN
    }
];

export const LangContext = React.createContext<Lang>(Lang.CN);

export const getLang = (key: string, lang: Lang) => {
    if (lang === Lang.EN) return EN[key] || key;
    else if (lang === Lang.CN) return CN[key] || key;
};