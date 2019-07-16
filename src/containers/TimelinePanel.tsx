import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TimeScale from '../components/TimeScale';
import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles, withTheme, Theme } from '@material-ui/core/styles';
import { OpenInNew, ArrowDropDown } from '@material-ui/icons';
import Waveform from '../components/Waveform';
import { TimelineState, ACTION_CLIP_REGION_CHANGE } from '../store/models/timeline/types';
import combineClassNames from '../utils/combineClassNames';
import { SourceState } from '../store/models/source/types';
import LoadButton from '../components/LoadButton';
import ControlBar from './ControlBar';
import useMovement from '../hooks/useMovement';
import { LangContext, getLang } from '../lang';

const mapStateToProps = ({ timeline, source, }: {timeline: TimelineState; source: SourceState}) => {
    return {
        source,
        timeline
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onClipRegionChange: dispatch.timeline[ACTION_CLIP_REGION_CHANGE]
    };
};

const CONTROL_BAR_HEIGHT = 64;

const useStyles = (theme: Theme) => {
    return makeStyles({
        root: {
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'auto hidden',
            paddingTop: `${CONTROL_BAR_HEIGHT}px`,
        },
        controlBar: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${CONTROL_BAR_HEIGHT}px`
        },
        main: {
            position: 'relative',
            width: '100%',
            overflow: 'auto hidden',
            height: '100%',
            boxSizing: 'border-box',
            marginBottom: `${theme.spacing(2)}px`
        },
        content: {
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
        },
        timeScale: {
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.12)'
        },
        thumb: {
            position: 'relative'
        }
    });
};

export interface TimelinePanelProps extends React.HTMLAttributes<{}>{
    timeline: TimelineState;
    source: SourceState;
    timeScaleHeight?: number;
    waveHeight?: number;
    onClipRegionChange: (v: {start: number; end: number}) => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(({
    timeline, source, theme, className, timeScaleHeight, waveHeight,
    onClipRegionChange,
    ...others
}: TimelinePanelProps & {theme: Theme}) => {
    const lang = useContext(LangContext);
    const [cliping, setCliping] = useState(false);
    const classes = useStyles(theme)();
    const tsh = timeScaleHeight || 40;
    const wh = waveHeight || 64;
    const { timeUnits, pixelsPerMSec, duration } = timeline;
    const sourceBuffers: Float32Array[] = [];
    const sourceDuration = source.audioBuffer ? source.audioBuffer.duration * 1000 : 0;
    if (source.audioBuffer) {
        for (let i = 0; i < source.audioBuffer.numberOfChannels; i++) {
            sourceBuffers.push(source.audioBuffer.getChannelData(i));
        }
    }

    const timeScaleMoveHook = useMovement();
    const timeScaleMouseDown = timeScaleMoveHook.onMouseDown;
    const timeScaleHasDown = timeScaleMoveHook.hasDown;
    const timeScaleIsDragging = timeScaleMoveHook.isDragging;
    const timeScaleDownPos = timeScaleMoveHook.downPos;
    const timeScaleCurPos = timeScaleMoveHook.curPos;
    useEffect(() => {
        if (timeScaleHasDown && timeScaleIsDragging) {
            const start = Math.min(timeScaleCurPos.x, timeScaleDownPos.x) / pixelsPerMSec;
            const end = Math.max(timeScaleCurPos.x, timeScaleDownPos.x) / pixelsPerMSec;
            onClipRegionChange({ start, end });
        }
    }, [timeScaleHasDown, timeScaleIsDragging, timeScaleDownPos.x, timeScaleCurPos.x]);
    return (
        <div className={combineClassNames(
            classes.root,
            className
        )} {...others}>
            <ControlBar className={classes.controlBar} cliping={cliping} onClipingChange={setCliping} />
            <div className={classes.main} style={{ paddingTop: `${tsh}px` }}>
                <TimeScale
                    className={classes.timeScale}
                    timeUnits={timeUnits}
                    pixelsPerMSec={pixelsPerMSec}
                    duration={duration}
                    height={tsh}
                    onMouseDown={timeScaleMouseDown}
                />
                <div className={classes.content}>
                    {
                        source.loading ? (
                            <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                                <CircularProgress />
                            </Box>
                        ) : (
                            sourceBuffers.length > 0 ? (
                                sourceBuffers.map((b, i) => (
                                    <Waveform key={i} height={wh} pixelsPerMSec={pixelsPerMSec} duration={sourceDuration} buffer={b} />
                                ))
                            ) : (
                                <Box height="100%" display="flex" flexDirection="column"
                                    alignItems="center" justifyContent="center">
                                    <LoadButton color="primary" variant="contained">
                                        <OpenInNew />
                                        &nbsp;
                                        {
                                            getLang('LOAD_SOURCE_FROM', lang)
                                        }
                                        ...
                                        <ArrowDropDown />
                                    </LoadButton>
                                </Box>
                            )
                        )
                    }
                </div>
            </div>
            <div className={classes.thumb}>

            </div>
        </div>
    );
}));