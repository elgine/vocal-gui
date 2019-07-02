import React, { useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdContentCut, MdDelete, MdUndo, MdRedo, MdZoomIn, MdZoomOut, MdSkipPrevious, MdSkipNext } from 'react-icons/md';
import Button, { PlayButton } from '../components/Button';
import TimelinePanel from './TimelinePanel';
import Divider from '../components/Divider';
import Header from './Header';
import { ControlBar } from '../components/ControlBar';
import TooltipButton from '../components/Button/TooltipButton';
import Volume from '../components/Volume';
import RepeatButton from '../components/Button/RepeatButton';
import Slider from '../components/Slider';
import TimeInput from '../components/Input/TimeInput';

const HEADER_HEIGHT = 64;
const EDITOR_CONTROLBAR_HEIGHT = 44;
const PLAYER_CONTROLBAR_HEIGHT = 64;
const ICON_SIZE = 16;

const editorStyles = (theme: Theme): any => {
    return {
        boxSizing: 'border-box',
        paddingBottom: `${PLAYER_CONTROLBAR_HEIGHT}px`,
        height: '100%',
        '.header': {
            height: `${HEADER_HEIGHT}px`
        },
        '.editor-controlbar': {
            height: `${EDITOR_CONTROLBAR_HEIGHT}px`,
            backgroundColor: theme.palette.background.body
        },
        '.timeline': {
            position: 'relative',
            width: '100%',
            height: `calc(100% - ${HEADER_HEIGHT + EDITOR_CONTROLBAR_HEIGHT + 1}px)`,
            background: '#000'
        },
        '.player-controlbar': {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${PLAYER_CONTROLBAR_HEIGHT}px`
        }
    };
};

export default () => {
    const [time, setTime] = useState(0);
    return (
        <div css={editorStyles}>
            <Header iconSize={ICON_SIZE} className="header" />
            <Divider />
            <ControlBar
                className="editor-controlbar"
                leftChildren={
                    <React.Fragment>
                        <TooltipButton flat tooltip="Cut">
                            <MdContentCut size={ICON_SIZE} />
                        </TooltipButton>
                        <TooltipButton flat tooltip="Delete">
                            <MdDelete size={ICON_SIZE} />
                        </TooltipButton>
                        <TooltipButton flat tooltip="Undo">
                            <MdUndo size={ICON_SIZE} />
                        </TooltipButton>
                        <TooltipButton flat tooltip="Redo">
                            <MdRedo size={ICON_SIZE} />
                        </TooltipButton>
                    </React.Fragment>
                }
                rightChildren={
                    <React.Fragment>
                        <React.Fragment>
                            <TooltipButton flat tooltip="Zoom-out timeline">
                                <MdZoomOut size={ICON_SIZE} />
                            </TooltipButton>
                            <TooltipButton flat tooltip="Zoom-in timeline">
                                <MdZoomIn size={ICON_SIZE} />
                            </TooltipButton>
                            <Slider />
                        </React.Fragment>
                    </React.Fragment>
                }
            />
            <TimelinePanel className="timeline" />
            <ControlBar
                className="player-controlbar"
                leftChildren={
                    <Volume iconSize={ICON_SIZE} anchorPos={{ horizontal: 'center', vertical: 'top' }}
                        transformPos={{ horizontal: 'center', vertical: 'bottom' }}
                    />
                }
                centerChildren={
                    <React.Fragment>
                        <TooltipButton flat tooltip="Skip previous">
                            <MdSkipPrevious size={ICON_SIZE} />
                        </TooltipButton>
                        <PlayButton size="lg" flat iconSize={ICON_SIZE * 1.5} />
                        <TooltipButton flat tooltip="Skip next">
                            <MdSkipNext size={ICON_SIZE} />
                        </TooltipButton>
                    </React.Fragment>
                }
                rightChildren={
                    <React.Fragment>
                        <TimeInput value={time} onChange={setTime} />
                        <RepeatButton iconSize={ICON_SIZE} flat />
                    </React.Fragment>
                }
            />
        </div>
    );
};