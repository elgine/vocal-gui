import React, { useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdContentCut, MdDelete, MdUndo, MdRedo, MdZoomIn, MdZoomOut, MdFileDownload } from 'react-icons/md';
import Button from '../components/Button';
import TimelinePanel from './TimelinePanel';
import PlayerControlBar from './PlayerControlBar';
import Divider from '../components/Divider';
import Header from './Header';
import { ControlBar } from '../components/ControlBar';
import TimeScaleControls from '../components/Timeline/TimeScaleControls';
import { PopoverPosition } from '../components/Popover/Popover';
import Tooltip from '../components/Tooltip';
import { TooltipProps } from '../components/Tooltip/Tooltip';
import { ButtonProps } from '../components/Button/Button';
import TooltipButton from '../components/Button/TooltipButton';

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
            <PlayerControlBar />
        </div>
    );
};