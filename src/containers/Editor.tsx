import React, { useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdContentCut, MdDelete, MdUndo, MdRedo, MdZoomIn, MdZoomOut, MdSkipPrevious, MdSkipNext } from 'react-icons/md';
import Button, { PlayButton } from '../components/Button';
import TimelinePanel from './TimelinePanel';
import Divider from '../components/Divider';
import Header from './Header';
import { ControlBar } from '../components/ControlBar';
import TimeScaleControls from '../components/Timeline/TimeScaleControls';
import TooltipButton from '../components/Button/TooltipButton';
import Volume from '../components/Volume';
import RepeatButton from '../components/Button/RepeatButton';

const HEADER_HEIGHT = 64;

const editorStyles = (theme: Theme): any => {
    return {
        boxSizing: 'border-box',
        '.header': {
            height: `${HEADER_HEIGHT}px`
        }
    };
};

export default () => {
    return (
        <div css={editorStyles}>
            <Header className="header" />
            <Divider />
            <ControlBar
                leftChildren={
                    <React.Fragment>
                        <TooltipButton flat tooltip="Cut">
                            <MdContentCut />
                        </TooltipButton>
                        <TooltipButton flat tooltip="Delete">
                            <MdDelete />
                        </TooltipButton>
                        <TooltipButton flat tooltip="Undo">
                            <MdUndo />
                        </TooltipButton>
                        <TooltipButton flat tooltip="Redo">
                            <MdRedo />
                        </TooltipButton>
                    </React.Fragment>
                }
                rightChildren={
                    <React.Fragment>
                        <React.Fragment>
                            <TooltipButton flat tooltip="Zoom-in timeline">
                                <MdZoomIn />
                            </TooltipButton>
                            <TooltipButton flat tooltip="Zoom-out timeline">
                                <MdZoomOut />
                            </TooltipButton>
                            <TimeScaleControls flat tooltip="Scale timeline" />
                        </React.Fragment>
                    </React.Fragment>
                }
            />
            <TimelinePanel />
            <ControlBar
                leftChildren={
                    <Volume anchorPos={{ horizontal: 'center', vertical: 'top' }}
                        transformPos={{ horizontal: 'center', vertical: 'bottom' }}
                        vertical
                    />
                }
                centerChildren={
                    <React.Fragment>
                        <TooltipButton flat tooltip="Skip previous">
                            <MdSkipPrevious />
                        </TooltipButton>
                        <PlayButton size="lg" flat />
                        <TooltipButton flat tooltip="Skip next">
                            <MdSkipNext />
                        </TooltipButton>
                    </React.Fragment>
                }
                rightChildren={
                    <RepeatButton flat />
                }
            />
        </div>
    );
};