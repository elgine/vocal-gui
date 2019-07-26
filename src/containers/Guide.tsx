import React, { useState, useContext, useMemo } from 'react';
import { useTheme, Theme, makeStyles } from '@material-ui/core/styles';
import useFirst from '../hooks/useFirst';
import { LangContext, getLang } from '../lang';
import { Portal, Tooltip, Box, Popper, ClickAwayListener, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';

const useBeaconStyles = makeStyles((theme: Theme) => {
    const color = theme.palette.primary[theme.palette.type];
    return {
        '@global': {
            '@keyframes pulse': {
                '0%': {
                    transform: 'scale(1)'
                },
                '55%': {
                    backgroundColor: 'rgba(255, 100, 100, 0.9)',
                    transform: 'scale(1.6)',
                }
            }
        },
        root: {
            position: 'absolute',
            animation: 'pulse 1s ease-in-out infinite',
            backgroundColor: color,
            borderRadius: '50%',
            display: 'none',
            height: '3rem',
            width: '3rem',
            '&.beacon-opened': {
                display: 'inline-block'
            }
        }
    };
});

interface BeaconProps extends React.HTMLAttributes<{}>{
    open?: boolean;
}

const Beacon = ({ className, open, ...others }: BeaconProps) => {
    const classes = useBeaconStyles();
    return (
        <div className={clsx(classes.root, className, open ? 'beacon-opened' : '')} {...others}></div>
    );
};

interface Step{
    target: string;
    content?: string;
    placement?: string;
}

export interface GuideProps{

}

export default (props: GuideProps) => {
    // const { first, setFirst } = useFirst();
    const theme = useTheme();
    const lang = useContext(LangContext);
    const [first, setFirst] = useState(true);
    const steps: Step[] = useMemo(() => {
        return [
            {
                target: '#zoom-controls',
                placement: 'auto',
                content: getLang('ZOOM_CONTROLS_TIPS', lang)
            },
            {
                target: '#time-scale',
                placement: 'auto',
                content: getLang('TIME_SCALE_TIPS', lang)
            },
            {
                target: '[id^=waveform]',
                placement: 'auto',
                content: getLang('WAVEFORM_TIPS', lang)
            },
            {
                target: '#player-volume',
                placement: 'auto',
                content: getLang('PLAYER_VOLUME_TIPS', lang)
            },
            {
                target: '#player-control-list',
                placement: 'top',
                content: getLang('PLAYER_CONTROL_LIST_TIPS', lang)
            },
            {
                target: '#effect-panel-collapse-button',
                placement: 'top',
                content: getLang('EFFECT_PANEL_COLLAPSE_BUTTON_TIPS', lang)
            },
            {
                target: '#effect-panel',
                placement: 'left',
                content: getLang('EFFECT_PANEL_TIPS', lang)
            }
        ];
    }, [lang]);

    const locale: Dictionary<string> = useMemo(() => ({
        back: getLang('BACK', lang) || '',
        close: getLang('CLOSE', lang) || '',
        last: getLang('LAST', lang) || '',
        next: getLang('NEXT', lang) || '',
        skip: getLang('SKIP', lang) || '',
    }), [lang]);

    const [openTour, setOpenTour] = useState(false);
    const [tourIndex, setTourIndex] = useState(0);

    const onTourClose = () => {
        setTourIndex(tourIndex + 1);
        setOpenTour(false);
    };

    const step = steps[tourIndex];
    return (
        <React.Fragment>
            <Portal container={document.body}>
                <Beacon onClick={() => setOpenTour(true)} />
            </Portal>
            <ClickAwayListener onClickAway={onTourClose}>
                <Popper open={openTour}>
                    <Paper>
                        <Box p={2}>
                            <Typography variant="subtitle1"></Typography>
                            {}
                        </Box>
                    </Paper>
                </Popper>
            </ClickAwayListener>
        </React.Fragment>
    );
};