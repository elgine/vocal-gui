export const ACTION_SWITCH_LANG = 'ACTION_SWITCH_LANG';
export const REDUCER_SET_LANG = 'REDUCER_SET_LANG';

import { Lang } from '../../../lang';

export interface LocaleState{
    lang: Lang;
}