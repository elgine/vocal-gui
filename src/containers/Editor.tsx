import React, { useState } from 'react';
import { Slide, useMediaQuery } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import combineClassNames from '../utils/combineClassNames';
import PlayerControls from './PlayerControls';
import TimelinePanel from './TimelinePanel';
import scrollBar from '../components/mixins/scrollBar';
import { fade } from '../utils/color';
import ControlBar from './ControlBar';
import EffectPanel from './EffectPanel';

const PLAYER_CONTROLS_HEIGHT = 64;
const CONTROL_BAR_HEIGHT = 64;
const EFFECT_DRAWER_WIDTH = 420;

const useStyles = makeStyles((theme: Theme) => {
    const contrastC = theme.palette.getContrastText(theme.palette.background.default);
    const easing = theme.transitions.easing.sharp;
    const duration = theme.transitions.duration.leavingScreen;
    return {
        '@global': {
            ...scrollBar({
                width: 12,
                trackBgColor: fade(contrastC, 0.02),
                thumbBgColor: fade(contrastC, 0.08),
                thumbBgColorHover: fade(contrastC, 0.12),
                thumbBgColorActive: fade(contrastC, 0.21)
            })
        },
        controlBar: {
            height: `${CONTROL_BAR_HEIGHT}px`
        },
        root: {
            position: 'relative',
            height: '100%'
        },
        content: {
            position: 'relative',
            height: `calc(100% - ${CONTROL_BAR_HEIGHT + PLAYER_CONTROLS_HEIGHT}px)`,
            boxSizing: 'border-box',
            overflow: 'hidden',
            transition: theme.transitions.create('padding', {
                easing,
                duration
            }),
            paddingRight: 0,
        },
        contentShifted: {
            transition: theme.transitions.create('padding', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            paddingRight: EFFECT_DRAWER_WIDTH
        },
        effectPanel: {
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            overflow: 'hidden auto',
            boxSizing: 'border-box',
            width: EFFECT_DRAWER_WIDTH
        },
        playerControls: {
            height: `${PLAYER_CONTROLS_HEIGHT}px`
        }
    };
});

export interface EditorProps extends React.HTMLAttributes<{}>{

}

export default ({ className, ...others }: EditorProps) => {
    const classes = useStyles();
    const matches = useMediaQuery('(min-width: 600px)');
    const [openEffectPanel, setOpenEffectPanel] = useState(false);
    const onToggleEffectPanel = (v: boolean) => {
        setOpenEffectPanel(v);
    };
    return (
        <div className={combineClassNames(
            classes.root,
            className
        )} {...others}>
            <ControlBar className={classes.controlBar} />
            <div className={combineClassNames(classes.content, openEffectPanel && matches ? classes.contentShifted : '')}>
                <Slide direction="left" in={openEffectPanel}>
                    <div className={classes.effectPanel}>
                        <EffectPanel />
                    </div>
                </Slide>
                <TimelinePanel />
            </div>
            <PlayerControls className={classes.playerControls}
                showEffectPanel={openEffectPanel}
                onToggleEffectPanel={onToggleEffectPanel}
            />
        </div>
    );
};