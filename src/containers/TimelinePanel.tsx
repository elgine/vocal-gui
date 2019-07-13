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
            marginBottom: `${theme.spacing(2)}px`
        },
        timeScale: {
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper,
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
                <div className={classes.main}>
                    <TimeScale
                        className={classes.timeScale}
                        timeUnits={timeUnits}
                        pixelsPerMSec={pixelsPerMSec}
                        duration={duration}
                        height={tsh}
                    />
                    {
                        source.loading ? (
                            <Box height={`${wh * 2}px`} lineHeight={`${wh * 2}px`} textAlign="center">
                                <CircularProgress />
                            </Box>
                        ) : (
                            sourceBuffers.length > 0 ? (
                                sourceBuffers.map((b, i) => (
                                    <Waveform key={i} height={wh} pixelsPerMSec={pixelsPerMSec} duration={sourceDuration} buffer={b} />
                                ))
                            ) : (
                                <Box height={`${wh * 2}px`} lineHeight={`${wh * 2}px`} textAlign="center">
                                    <LoadButton />
                                </Box>
                            )
                        )
                    }
                </div>
                <div className={classes.thumb}>

                </div>
            </div>
        </React.Fragment>
    );
}));