import React, { useState, useRef, useCallback } from 'react';
import { Box, Theme, Fade } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import TimeScale from '../components/TimeScale';
import Waveform from '../components/Waveform';
import Selection from '../components/Selection';
import { fade } from '../utils/color';
import Pointer from '../components/Pointer';
import { toTimeString } from '../utils/time';
import { TIME_UNITS } from '../constant';

export interface TimelineProps{
    audioBuffer?: AudioBuffer;
    timeUnits?: number[];
    pixelsPerMSec?: number;
    currentTime?: number;
    waveHeight?: number;
    timeScaleHeight?: number;
    segment?: Segment;
}

export default withTheme(({ theme, audioBuffer, segment, timeUnits, pixelsPerMSec, currentTime, waveHeight, timeScaleHeight }: TimelineProps & {theme: Theme}) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const tus = timeUnits || TIME_UNITS;
    const ppms = pixelsPerMSec || 0.01;
    const ct = currentTime || 3000;
    const wh = waveHeight || 128;
    const tsh = timeScaleHeight || 48;
    const s = segment || { start: 2000, end: 10000 };
    const color = theme.palette.getContrastText(theme.palette.background.default);
    const timeScaleColors = [
        fade(color, 0.65),
        fade(color, 0.45),
        fade(color, 0.25)
    ];

    const [preSeek, setPreSeek] = useState(0);
    const [showPreSeek, setShowPreSeek] = useState(false);
    const onMouseMove = (e: React.MouseEvent) => {
        setShowPreSeek(true);
        setPreSeek((e.pageX + (boxRef.current ? boxRef.current.scrollLeft : 0)) / ppms);
    };
    const onMouseLeave = (e: React.MouseEvent) => {
        setShowPreSeek(false);
    };
    const stopPreSeek = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPreSeek(false);
    };
    const innerCompGenerator = useCallback(({ children, ...props }: any) => <div ref={boxRef} {...props}>{children}</div>, []);
    const duration = audioBuffer ? audioBuffer.duration * 1000 : 0;
    return (
        <Box component={innerCompGenerator} position="relative" bgcolor="background.default"
            overflow="auto hidden" width="100%"
            onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
            <TimeScale duration={duration} timeUnits={tus} pixelsPerMSec={ppms} colors={timeScaleColors} height={tsh} />
            {
                audioBuffer ? Array(audioBuffer.numberOfChannels).fill(0).map((item, i) => {
                    return (
                        <Waveform key={i} duration={duration} height={wh}
                            buffer={audioBuffer.getChannelData(i)}
                            pixelsPerMSec={ppms}
                            color={timeScaleColors[0]}
                        />
                    );
                }) : undefined
            }
            <Fade in={showPreSeek}>
                <Pointer hideHead showLabel={showPreSeek} label={toTimeString(preSeek)}
                    color={timeScaleColors[2]} left={ppms * preSeek}
                />
            </Fade>
            {
                s.start !== s.end ? <Selection pixelsPerMSec={ppms} start={s.start} end={s.end} /> : undefined
            }
            <Pointer onMouseOver={stopPreSeek} label={toTimeString(ct)} left={ppms * ct} />
        </Box>
    );
});