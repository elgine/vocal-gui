import React, { useContext } from 'react';
import { connect } from 'react-redux';
import TimeScale from '../components/TimeScale';
import { Box, CircularProgress, Button, ButtonGroup, Popover } from '@material-ui/core';
import { makeStyles, withTheme, Theme } from '@material-ui/core/styles';
import { ArrowDropDown } from '@material-ui/icons';
import Waveform from '../components/Waveform';
import { TimelineState } from '../store/models/timeline/types';
import combineClassNames from '../utils/combineClassNames';
import { SourceState } from '../store/models/source/types';
import UploadButton from '../components/UploadButton';
import { getLang, LangContext } from '../lang';
import LoadButton from '../components/LoadButton';
import { contrast } from '../utils/color';

const mapStateToProps = ({ timeline, source, }: {timeline: TimelineState; source: SourceState}) => {
    return {
        source,
        timeline
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {

    };
};

const useStyles = (theme: Theme) => {
    return makeStyles({
        root: {
            position: 'relative',
            width: '100%',
            overflow: 'auto hidden'
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
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(({
    timeline, source, theme, className, timeScaleHeight, waveHeight,
    ...others
}: TimelinePanelProps & {theme: Theme}) => {
    const lang = useContext(LangContext);
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
    return (
        <React.Fragment>
            <div className={combineClassNames(
                classes.root,
                className
            )} {...others}>
                <div className={classes.main} style={{ paddingTop: `${tsh}px` }}>
                    <TimeScale
                        className={classes.timeScale}
                        timeUnits={timeUnits}
                        pixelsPerMSec={pixelsPerMSec}
                        duration={duration}
                        height={tsh}
                    />
                    <div className={classes.content}>
                        {
                            source.loading ? (
                                <Box py={2} textAlign="center">
                                    <CircularProgress />
                                </Box>
                            ) : (
                                sourceBuffers.length > 0 ? (
                                    sourceBuffers.map((b, i) => (
                                        <Waveform key={i} height={wh} pixelsPerMSec={pixelsPerMSec} duration={sourceDuration} buffer={b} />
                                    ))
                                ) : (
                                    <Box py={2} textAlign="center">
                                        <LoadButton variant="contained" />
                                    </Box>
                                )
                            )
                        }
                    </div>
                </div>
                <div className={classes.thumb}>

                </div>
            </div>
        </React.Fragment>
    );
}));