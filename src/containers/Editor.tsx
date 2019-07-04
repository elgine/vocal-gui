import React, { useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdBorderStyle, MdUndo, MdRedo, MdZoomIn, MdZoomOut, MdAudiotrack, MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import TimeScale from '../components/Timeline/TimeScale';
import ControlBar from '../components/ControlBar';
import TooltipButton from '../components/Button/TooltipButton';
import Slider from '../components/Slider';
import Volume from '../components/Volume';
import PlayButton from './PlayButton';
import RepeatButton from './RepeatButton';
import Header from './Header';
import Button from '../components/Button';
import Timeline from './Timeline';
import { Tabs, TabPane } from '../components/Tabs';

const EDITOR_CONTROLBAR_HEIGHT = 48;
const ICON_SIZE = 18;
const TIME_SCALE_HEIGHT = 56;
const PLAYER_CONROLBAR_HEIGHT = 56;
const HEADER_HEIGHT = 72;

const editorStyles = (theme: Theme): any => {
    return {
        boxSizing: 'border-box',
        '.export-panel': {
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            backgroundColor: theme.palette.background.surface
        },
        '.controlbar': {
            backgroundColor: theme.palette.background.surface
        },
        '.player-controlbar': {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%'
        }
    };
};

export default () => {
    const combinedStyle: React.CSSProperties = {
        padding: `0 0 ${PLAYER_CONROLBAR_HEIGHT}px 0`
    };
    return (
        <div css={editorStyles} style={combinedStyle}>
            <Timeline />
        </div>
    );
};