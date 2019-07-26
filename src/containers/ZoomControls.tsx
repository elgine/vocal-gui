import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { Box, Slider, IconButton, Tooltip } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';
import { ZOOM_MINIMUM, ZOOM_MAXIMUM, SLIDER_STEP_COUNT } from '../constant';
import { ACTION_ZOOM_IN, ACTION_ZOOM_OUT, ACTION_ZOOM } from '../store/models/timeline/types';

export interface ZoomControlsProps{
    zoom: number;
    onZoom: (v: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

const mapStateToProps = (state: any) => {
    return {
        zoom: state.timeline.zoom
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onZoomIn: dispatch.timeline[ACTION_ZOOM_IN],
        onZoomOut: dispatch.timeline[ACTION_ZOOM_OUT],
        onZoom: dispatch.timeline[ACTION_ZOOM]
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({ zoom, onZoom, onZoomIn, onZoomOut }: ZoomControlsProps) => {
    const lang = useContext(LangContext);
    const onZoomSliderChange = (e: React.ChangeEvent<{}>, v: number | number[]) => {
        onZoom(typeof v === 'number' ? v : v[0]);
    };
    const step = (ZOOM_MAXIMUM - ZOOM_MINIMUM) / SLIDER_STEP_COUNT;
    return (
        <Box id="zoom-controls" display="flex" alignItems="center" overflow="hidden visible">
            <Tooltip title={getLang('ZOOM_IN_TIMELINE', lang)}>
                <IconButton onClick={onZoomIn}>
                    <ZoomIn />
                </IconButton>
            </Tooltip>
            <Tooltip title={getLang('ZOOM_OUT_TIMELINE', lang)}>
                <IconButton onClick={onZoomOut}>
                    <ZoomOut />
                </IconButton>
            </Tooltip>
            <Box m={3} width="128px">
                <Slider value={zoom}
                    step={step}
                    min={ZOOM_MINIMUM}
                    max={ZOOM_MAXIMUM}
                    onChange={onZoomSliderChange}
                />
            </Box>
        </Box>
    );
}, (prevProps: ZoomControlsProps, nextProps: ZoomControlsProps) => {
    return prevProps.zoom === nextProps.zoom;
}));