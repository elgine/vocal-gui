import React, { useContext, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { clamp } from 'lodash';
import TimeScale from '../components/TimeScale';
import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles, Theme, withTheme } from '@material-ui/core/styles';
import { OpenInNew, ArrowDropDown } from '@material-ui/icons';
import Waveform from '../components/Waveform';
import { TimelineState, ACTION_CLIP_REGION_CHANGE } from '../store/models/timeline/types';
import combineClassNames from '../utils/combineClassNames';
import { SourceState, ACTION_LOAD_SOURCE } from '../store/models/source/types';
import LoadButton from './LoadButton';
import useMovement from '../hooks/useMovement';
import Pointer from '../components/Pointer';
import { LangContext, getLang } from '../lang';
import { fade, contrast } from '../utils/color';
import { PlayerState, ACTION_SEEK } from '../store/models/player/types';
import ClipRegion from '../components/ClipRegion';

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
        onSeek: dispatch.player[ACTION_SEEK],
        onClipRegionChange: dispatch.timeline[ACTION_CLIP_REGION_CHANGE],
        onLoadSource: dispatch.source[ACTION_LOAD_SOURCE]
    };
};

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'auto hidden',
            boxSizing: 'border-box'
        },
        main: {
            position: 'relative',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            overflow: 'auto',
            backgroundColor: contrast(theme.palette.text.primary)
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
            boxSizing: 'border-box',
            borderBottom: `1px solid ${theme.palette.divider}`
        },
        waveform: {
            borderBottom: `1px solid ${fade(theme.palette.divider, 0.65)}`
        }
    };
});

export interface TimelinePanelProps extends React.HTMLAttributes<{}>, TimelineState{
    currentTime: number;
    loading: boolean;
    audioBuffer?: AudioBuffer;
    timeScaleHeight?: number;
    waveHeight?: number;
    onSeek: (v: number) => void;
    onClipRegionChange: (v: number[]) => void;
    onLoadSource: (v: {type: SourceType; value?: string | File | AudioBuffer}) => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(({
    theme, className, timeScaleHeight, waveHeight, pixelsPerMSec,
    currentTime, timeUnits, duration, zoom, audioBuffer, loading, clipRegion,
    onClipRegionChange, onLoadSource, onSeek,
    ...others
}: TimelinePanelProps & {theme: Theme}) => {
    const primary = theme.palette.primary[theme.palette.type];
    const lang = useContext(LangContext);
    const tsh = timeScaleHeight || 40;
    const wh = waveHeight || 128;
    const showRegion = clipRegion[0] !== clipRegion[1];
    const classes = useStyles();
    const sourceBuffers: Float32Array[] = [];
    const sourceDuration = audioBuffer ? audioBuffer.duration * 1000 : 0;
    const channels = audioBuffer ? audioBuffer.numberOfChannels : 0;
    if (audioBuffer) {
        for (let i = 0; i < channels; i++) {
            sourceBuffers.push(audioBuffer.getChannelData(i));
        }
    }

    const pointerLeft = currentTime * pixelsPerMSec;
    const mainRef = useRef<HTMLDivElement>(null);

    const onTimeScaleClick = (e: React.MouseEvent) => {
        onSeek((e.pageX + (mainRef.current ? mainRef.current.scrollLeft : 0)) / pixelsPerMSec);
    };

    const pointerMoveHook = useMovement();
    const pointerHasDown = pointerMoveHook.hasDown;
    const pointerIsDragging = pointerMoveHook.isDragging;
    const pointerDownPos = pointerMoveHook.downPos;
    const pointerCurPos = pointerMoveHook.curPos;
    const onPointerMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        pointerMoveHook.onMouseDown(e);
    };

    const [lastCurrentTime, setLastCurrentTime] = useState(0);
    useEffect(() => {
        if (pointerHasDown && !pointerIsDragging) {
            setLastCurrentTime(currentTime);
        }
    }, [pointerHasDown, pointerIsDragging, currentTime]);
    useEffect(() => {
        if (pointerHasDown && pointerIsDragging) {
            let newCurrentTime = lastCurrentTime + (pointerCurPos.x - pointerDownPos.x) / pixelsPerMSec;
            onSeek(newCurrentTime);
        }
    }, [pointerHasDown, pointerIsDragging, pointerDownPos.x, pointerCurPos.x, lastCurrentTime, pixelsPerMSec, onSeek]);

    const [lastClipStart, setLastClipStart] = useState(0);
    const [lastClipEnd, setLastClipEnd] = useState(0);
    const regionStartMoveHook = useMovement();
    const regionStartHasDown = regionStartMoveHook.hasDown;
    const regionStartIsDragging = regionStartMoveHook.isDragging;
    const regionStartDownPos = regionStartMoveHook.downPos;
    const regionStartCurPos = regionStartMoveHook.curPos;
    const onRegionStartMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        regionStartMoveHook.onMouseDown(e);
    };
    useEffect(() => {
        if (regionStartHasDown && !regionStartIsDragging) {
            setLastClipStart(clipRegion[0]);
        }
    }, [regionStartHasDown, regionStartIsDragging, clipRegion[0]]);

    useEffect(() => {
        if (regionStartHasDown && regionStartIsDragging) {
            let newStart = lastClipStart + (regionStartCurPos.x - regionStartDownPos.x) / pixelsPerMSec;
            newStart = clamp(newStart, 0, clipRegion[1]);
            onClipRegionChange([newStart, clipRegion[1]]);
        }
    }, [regionStartHasDown, regionStartIsDragging, regionStartDownPos.x, regionStartCurPos.x, lastClipStart, clipRegion[1], pixelsPerMSec, onClipRegionChange]);

    const regionEndMoveHook = useMovement();
    const regionEndHasDown = regionEndMoveHook.hasDown;
    const regionEndIsDragging = regionEndMoveHook.isDragging;
    const regionEndDownPos = regionEndMoveHook.downPos;
    const regionEndCurPos = regionEndMoveHook.curPos;
    const onRegionEndMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        regionEndMoveHook.onMouseDown(e);
    };
    useEffect(() => {
        if (regionEndHasDown && !regionEndIsDragging) {
            setLastClipEnd(clipRegion[1]);
        }
    }, [regionEndHasDown, regionEndIsDragging, clipRegion[1]]);
    useEffect(() => {
        if (regionEndHasDown && regionEndIsDragging) {
            let newEnd = lastClipEnd + (regionEndCurPos.x - regionEndDownPos.x) / pixelsPerMSec;
            newEnd = clamp(newEnd, clipRegion[0], duration);
            onClipRegionChange([clipRegion[0], newEnd]);
        }
    }, [regionEndHasDown, regionEndIsDragging, regionEndDownPos.x, regionEndCurPos.x, lastClipEnd, clipRegion[0], pixelsPerMSec, onClipRegionChange]);

    const mainStyle: React.CSSProperties = {
        paddingTop: `${tsh}px`
    };
    const clipRegionStyle: React.CSSProperties = {
        height: `${wh * channels}px`
    };
    const pointerStyle: React.CSSProperties = {
        height: `${wh * channels + tsh}px`
    };
    return (
        <div className={combineClassNames(
            classes.root,
            className
        )} {...others}>
            <div ref={mainRef} className={classes.main} style={mainStyle}>
                <TimeScale
                    className={classes.timeScale}
                    timeUnits={timeUnits}
                    pixelsPerMSec={pixelsPerMSec}
                    duration={duration}
                    height={tsh}
                    onClick={onTimeScaleClick}
                />
                {
                    !loading && channels > 0 ? (
                        <div className={classes.content}>
                            {
                                sourceBuffers.map((b, i) => (
                                    <Waveform key={i} color="#fff" className={classes.waveform} height={wh}
                                        pixelsPerMSec={pixelsPerMSec} duration={sourceDuration} buffer={b}
                                    />
                                ))
                            }
                            {
                                showRegion ? <ClipRegion pixelsPerMSec={pixelsPerMSec} region={clipRegion} style={clipRegionStyle} /> : undefined
                            }
                        </div>
                    ) : (
                        <Box position="absolute" bottom="50%" width="100%" textAlign="center">
                            {
                                loading ? <CircularProgress /> : (
                                    <LoadButton color="primary" variant="contained" onLoadSource={onLoadSource}>
                                        <OpenInNew />
                                    &nbsp;
                                        {
                                            getLang('LOAD_SOURCE_FROM', lang)
                                        }
                                    ...
                                        <ArrowDropDown />
                                    </LoadButton>
                                )
                            }
                        </Box>
                    )
                }
                {
                    showRegion ? (
                        <React.Fragment>
                            <Pointer headShape="circular" color={primary} left={clipRegion[0] * pixelsPerMSec} style={pointerStyle}
                                onMouseDown={onRegionStartMouseDown}
                            />
                            <Pointer headShape="circular" color={primary} left={clipRegion[1] * pixelsPerMSec} style={pointerStyle}
                                onMouseDown={onRegionEndMouseDown}
                            />
                        </React.Fragment>
                    ) : undefined
                }
                {
                    audioBuffer ? <Pointer left={pointerLeft} style={pointerStyle}
                        onMouseDown={onPointerMouseDown}
                    /> : undefined
                }
            </div>
        </div>
    );
}));