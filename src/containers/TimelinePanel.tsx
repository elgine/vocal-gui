import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TimeScale from '../components/TimeScale';
import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles, withTheme, Theme } from '@material-ui/core/styles';
import { OpenInNew, ArrowDropDown } from '@material-ui/icons';
import Waveform from '../components/Waveform';
import { TimelineState, ACTION_CLIP_REGION_CHANGE, ACTION_ZOOM, ACTION_ZOOM_IN, ACTION_ZOOM_OUT } from '../store/models/timeline/types';
import combineClassNames from '../utils/combineClassNames';
import { SourceState, ACTION_LOAD_SOURCE } from '../store/models/source/types';
import LoadButton from '../components/LoadButton';
import ControlBar from './ControlBar';
import useMovement from '../hooks/useMovement';
import { LangContext, getLang } from '../lang';

const mapStateToProps = ({ timeline, source }: {timeline: TimelineState; source: SourceState}) => {
    return {
        source,
        timeline
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onClipRegionChange: dispatch.timeline[ACTION_CLIP_REGION_CHANGE],
        onLoadSource: dispatch.source[ACTION_LOAD_SOURCE],
        onZoom: dispatch.timeline[ACTION_ZOOM],
        onZoomIn: dispatch.timeline[ACTION_ZOOM_IN],
        onZoomOut: dispatch.timeline[ACTION_ZOOM_OUT]
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
            height: '100%',
            boxSizing: 'border-box',
            overflow: 'auto',
            marginBottom: `${theme.spacing(2)}px`
        },
        content: {
            position: 'relative',
            minWidth: '100%',
            display: 'inline-block',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
        },
        timeScale: {
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.25)'
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
    onLoadSource: (v: {type: SourceType; value?: string | File}) => void;
    onZoom: (v: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(({
    timeline, source, theme, className, timeScaleHeight, waveHeight,
    onClipRegionChange, onLoadSource, onZoom, onZoomIn, onZoomOut,
    ...others
}: TimelinePanelProps & {theme: Theme}) => {
    const lang = useContext(LangContext);
    const [cliping, setCliping] = useState(false);
    const classes = useStyles(theme)();
    const tsh = timeScaleHeight || 40;
    const wh = waveHeight || 128;
    const { timeUnits, pixelsPerMSec, duration, zoom } = timeline;
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
            <ControlBar className={classes.controlBar} cliping={cliping}
                onLoadSource={onLoadSource} onClipingChange={setCliping}
                zoom={zoom} onZoom={onZoom} onZoomIn={onZoomIn} onZoomOut={onZoomOut}
            />
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
                                    <LoadButton color="primary" variant="contained" onLoadSource={onLoadSource}>
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
        </div>
    );
}));