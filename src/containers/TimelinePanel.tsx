import React, { useContext, useLayoutEffect, useState, useEffect, useRef } from 'react';
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
import Pointer from '../components/Pointer';
import { LangContext, getLang } from '../lang';
import { fade, contrast } from '../utils/color';
import { PlayerState } from '../store/models/player/types';
import ClipRegion from '../components/ClipRegion';
import useResize from '../hooks/useResize';

const mapStateToProps = ({ timeline, player, source }: {timeline: TimelineState; player: PlayerState; source: SourceState}) => {
    return {
        currentTime: player.currentTime,
        audioBuffer: source.audioBuffer,
        loading: source.loading,
        ...timeline
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
const RATIO_OF_PAGE_WIDTH = 0.7;

const useStyles = makeStyles({
    root: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'auto hidden'
    },
    controlBar: {
        height: `${CONTROL_BAR_HEIGHT}px`
    },
    main: {
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'auto',
        height: `calc(100% - ${CONTROL_BAR_HEIGHT}px)`
    },
    content: {
        position: 'relative',
        minWidth: '100%',
        maxHeight: '100%',
        display: 'inline-block'
    },
    timeScale: {
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.25)'
    },
    thumb: {
        position: 'relative'
    }
});

export interface TimelinePanelProps extends React.HTMLAttributes<{}>, TimelineState{
    currentTime: number;
    loading?: boolean;
    audioBuffer?: AudioBuffer;
    timeScaleHeight?: number;
    waveHeight?: number;
    onClipRegionChange: (v: {start: number; end: number}) => void;
    onLoadSource: (v: {type: SourceType; value?: string | File}) => void;
    onZoom: (v: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(({
    theme, className, timeScaleHeight, waveHeight, pixelsPerMSec,
    currentTime, timeUnits, duration, zoom, audioBuffer, loading, clipRegion,
    onClipRegionChange, onLoadSource, onZoom, onZoomIn, onZoomOut,
    ...others
}: TimelinePanelProps & {theme: Theme}) => {
    const primary = theme.palette.primary[theme.palette.type];
    const lang = useContext(LangContext);
    const [cliping, setCliping] = useState(false);
    const tsh = timeScaleHeight || 40;
    const wh = waveHeight || 128;
    const showRegion = clipRegion.start !== clipRegion.end;
    const classes = useStyles();
    const sourceBuffers: Float32Array[] = [];
    const sourceDuration = audioBuffer ? audioBuffer.duration * 1000 : 0;
    const channels = audioBuffer ? audioBuffer.numberOfChannels : 0;
    if (audioBuffer) {
        for (let i = 0; i < channels; i++) {
            sourceBuffers.push(audioBuffer.getChannelData(i));
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

    // Auto-scroll if current time pointer is outside view
    const pointerLeft = currentTime * pixelsPerMSec;
    const pageSize = useResize(null);
    const mainRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (mainRef.current && (pointerLeft % pageSize.width) / pageSize.width > RATIO_OF_PAGE_WIDTH) {
            mainRef.current.scrollLeft = pointerLeft - pageSize.width * (1 - RATIO_OF_PAGE_WIDTH);
        }
    }, [pointerLeft, pageSize.width]);
    const mainStyle: React.CSSProperties = {
        paddingTop: `${tsh}px`,
        backgroundColor: contrast(theme.palette.text.primary)
    };
    const timeScaleStyle: React.CSSProperties = {
        boxSizing: 'border-box',
        borderBottom: `1px solid ${theme.palette.divider}`,
    };
    const clipRegionStyle: React.CSSProperties = {
        height: `${wh * channels}px`
    };
    const waveformStyle: React.CSSProperties = {
        borderBottom: `1px solid ${fade(theme.palette.divider, 0.65)}`,
    };
    return (
        <div className={combineClassNames(
            classes.root,
            className
        )} {...others}>
            <ControlBar className={classes.controlBar}
                clipRegion={clipRegion} cliping={cliping}
                onLoadSource={onLoadSource} onClipingChange={setCliping}
                zoom={zoom} onZoom={onZoom} onZoomIn={onZoomIn} onZoomOut={onZoomOut}
            />
            <div ref={mainRef} className={classes.main} style={mainStyle}>
                <TimeScale
                    className={classes.timeScale}
                    timeUnits={timeUnits}
                    pixelsPerMSec={pixelsPerMSec}
                    duration={duration}
                    height={tsh}
                    onMouseDown={timeScaleMouseDown}
                    style={timeScaleStyle}
                />
                {
                    loading ? (
                        <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        channels > 0 ? (
                            <div className={classes.content}>
                                {
                                    sourceBuffers.map((b, i) => (
                                        <Waveform key={i} color="#fff" style={waveformStyle} height={wh}
                                            pixelsPerMSec={pixelsPerMSec} duration={sourceDuration} buffer={b}
                                        />
                                    ))
                                }
                                {
                                    showRegion ? <ClipRegion pixelsPerMSec={pixelsPerMSec} region={clipRegion} style={clipRegionStyle} /> : undefined
                                }
                            </div>
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
                {
                    showRegion ? (
                        <React.Fragment>
                            <Pointer headShape="circular" color={primary} left={clipRegion.start * pixelsPerMSec} />
                            <Pointer headShape="circular" color={primary} left={clipRegion.end * pixelsPerMSec} />
                        </React.Fragment>
                    ) : undefined
                }
                {
                    audioBuffer ? <Pointer headShape="circular" left={pointerLeft} /> : undefined
                }
            </div>
        </div>
    );
}));