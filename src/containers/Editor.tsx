import React, { useState, useEffect, useContext } from 'react';
import { RematchDispatch } from '@rematch/core';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Slide, useMediaQuery, Paper, Fade } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import PlayerControlBar from './PlayerControlBar';
import TimelinePanel from './TimelinePanel';
import scrollBar from '../components/mixins/scrollBar';
import { fade } from '../utils/color';
import ControlBar from './ControlBar';
import EffectPanel from './EffectPanel';
import { ACTION_CALL_HOTKEY } from '../store/models/hotkeys/types';
import HelpButton from './HelpButton';
import { Models, RootState } from '../store';
import { ACTION_INITIALIZE } from '../store/models/editor/types';
import LoadingMask from '../components/LoadingMask';
import Guide from './Guide';
import { IntroContext } from '../components/Intro';

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
            height: '100%',
            boxSizing: 'border-box'
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
            overflowX: 'hidden',
            overflowY: 'auto',
            boxSizing: 'border-box',
            width: EFFECT_DRAWER_WIDTH
        },
        playerControls: {
            height: `${PLAYER_CONTROLS_HEIGHT}px`
        },
        helpButton: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2)
        }
    };
});

const mapStateToProps = ({ present }: RootState) => {
    return {
        initializing: present.editor.initializing
    };
};

export default ({ className, ...others }: React.HTMLAttributes<{}>) => {
    const { initializing } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const classes = useStyles();
    const matches = useMediaQuery('(min-width: 600px)');
    const [openEffectPanel, setOpenEffectPanel] = useState(false);
    const [openIntro, setOpenIntro] = useState(false);
    const onToggleEffectPanel = (v: boolean) => {
        setOpenEffectPanel(v);
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            dispatch.hotkeys[ACTION_CALL_HOTKEY]({
                hotkey: {
                    ctrl: e.ctrlKey,
                    shift: e.shiftKey,
                    alt: e.altKey,
                    keyCode: e.keyCode
                }
            });
        };
        window.addEventListener('keydown', onKeyDown);
        dispatch.editor[ACTION_INITIALIZE]();
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const intro = useContext(IntroContext);
    const onAnimationCompleted = () => {
        intro.next && intro.next();
    };
    return (
        <div className={clsx(
            classes.root,
            className
        )} {...others}>
            <Guide open={openIntro} onClose={() => setOpenIntro(false)}>
                <ControlBar className={classes.controlBar} />
                <div className={clsx(classes.content, openEffectPanel && matches ? classes.contentShifted : '')}>
                    <Slide direction="left" in={openEffectPanel} onEntered={onAnimationCompleted} onExited={onAnimationCompleted}>
                        <Paper id="effect-panel" className={classes.effectPanel}>
                            <EffectPanel />
                        </Paper>
                    </Slide>
                    <TimelinePanel />
                    <HelpButton open={!openEffectPanel}
                        color="secondary"
                        className={classes.helpButton}
                        onOpenIntro={() => setOpenIntro(true)}
                    />
                </div>
                <PlayerControlBar className={classes.playerControls}
                    showEffectPanel={openEffectPanel}
                    onToggleEffectPanel={onToggleEffectPanel}
                />
                <Fade in={initializing}>
                    <LoadingMask />
                </Fade>
            </Guide>
        </div>
    );
};