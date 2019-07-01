import React, { useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdContentCut, MdDelete, MdUndo, MdRedo, MdLinearScale, MdZoomIn, MdZoomOut, MdFileDownload } from 'react-icons/md';
import ControlBar from '../components/ControlBar';
import Button from '../components/Button';
import ListItemHeader from '../components/List/ListItemHeader';
import Tooltip from '../components/Tooltip';
import TimelinePanel from './TimelinePanel';
import PlayerControlBar from './PlayerControlBar';
import Divider from '../components/Divider';
import Popover from '../components/Popover';
import Slider from '../components/Slider';
import Box from '../components/Grid/Box';
import TimeScaleControls from '../components/Timeline/TimeScaleControls';
import Header from './Header';

const HEADER_HEIGHT = 64;

interface ControlBarButton{
    icon: React.ReactNode;
    title: string;
    key: string;
}

const controlBarButtons = {
    left: [
        {
            icon: <MdContentCut />,
            title: 'Cut',
            key: 'cut'
        },
        {
            icon: <MdDelete />,
            title: 'Delete',
            key: 'delete'
        },
        {
            icon: <MdUndo />,
            title: 'Undo',
            key: 'undo'
        },
        {
            icon: <MdRedo />,
            title: 'Redo',
            key: 'redo'
        }
    ],
    more: [],
    right: [
        {
            icon: <MdZoomIn />,
            title: 'Zoom in timeline',
            key: 'zoom-in-timeline'
        },
        {
            icon: <MdZoomOut />,
            title: 'Zoom out timeline',
            key: 'zoom-out-timeline'
        },
        {
            icon: <MdLinearScale />,
            title: 'Scale timeline',
            key: 'scale-timeline'
        }
    ]
};

const editorStyles = (theme: Theme): any => {
    return {
        boxSizing: 'border-box',
        '.header': {
            height: `${HEADER_HEIGHT}px`
        }
    };
};

export default () => {
    const onControlButtonClick = (e: React.MouseEvent, key: string) => {
        switch (key) {
            case 'cut': break;
            case 'delete': break;
            case 'undo': break;
            case 'redo': break;
            case 'zoom-in-timeline': break;
            case 'zoom-out-timeline': break;
            case 'scale-timeline':
                break;
        }
    };

    return (
        <div css={editorStyles}>
            <Header className="header" />
            <Divider />
            <ControlBar items={controlBarButtons}
                renderItem={({ key, icon, title }: ControlBarButton) => (
                    <Tooltip key={key} title={title}
                        anchorPos={{ horizontal: 'center', vertical: 'top' }}
                        transformPos={{ horizontal: 'center', vertical: 'bottom' }} >
                        {
                            key === 'scale-timeline' ? (
                                <TimeScaleControls />
                            ) : (
                                <Button flat onClick={(e: React.MouseEvent) => onControlButtonClick(e, key)}>
                                    {icon}
                                </Button>
                            )
                        }
                    </Tooltip>
                )} renderMoreItem={({ key, icon, title }: ControlBarButton) => (
                    <ListItemHeader key={key} onClick={(e: React.MouseEvent) => onControlButtonClick(e, key)}>
                        {icon}&nbsp;{title}
                    </ListItemHeader>
                )}
            />
            <TimelinePanel />
            <PlayerControlBar />
        </div>
    );
};