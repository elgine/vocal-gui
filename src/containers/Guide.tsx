import React, { useContext, useMemo } from 'react';
import Intro, { IntroStep, IntroProps } from '../components/Intro';
import { getLang, LangContext } from '../lang';

export interface GuideProps extends Omit<IntroProps, 'steps' | 'locale'>{

}

export default (props: GuideProps) => {
    const lang = useContext(LangContext);
    const steps: IntroStep[] = useMemo(() => ([
        {
            title: getLang('TIME_SCALE', lang),
            target: '#time-scale',
            placement: 'bottom-end',
            content: getLang('TIME_SCALE_TIPS', lang)
        },
        {
            title: getLang('ZOOM_CONTROLS', lang),
            target: '#zoom-controls',
            placement: 'bottom-end',
            content: getLang('ZOOM_CONTROLS_TIPS', lang)
        },
        {
            title: getLang('PLAYER_CONTROL_LIST', lang),
            target: '#player-control-list',
            placement: 'top',
            content: getLang('PLAYER_CONTROL_LIST_TIPS', lang)
        },
        {
            target: '#effect-panel-collapse-button',
            placement: 'top',
            controlled: true,
            content: getLang('EFFECT_PANEL_COLLAPSE_BUTTON_TIPS', lang)
        },
        {
            title: getLang('EFFECT_PANEL', lang),
            target: '#effect-panel',
            placement: 'left',
            content: getLang('EFFECT_PANEL_TIPS', lang)
        }
    ]), [lang]);
    const locale = useMemo(() => ({
        back: getLang('BACK', lang),
        next: getLang('NEXT', lang),
        close: getLang('CLOSE', lang)
    }), [lang]);
    return (
        <Intro steps={steps} locale={locale} {...props} />
    );
};