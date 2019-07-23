import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { Box, Slider, IconButton, Tooltip } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';
import { ZOOM_MINIMUM, ZOOM_MAXIMUM, SLIDER_STEP_COUNT } from '../constant';
import { ACTION_ZOOM_IN, ACTION_ZOOM_OUT, ACTION_ZOOM } from '../store/models/timeline/types';

export interface ZoomControlsProps{
    zoom: number;
    zoomMin?: number;
    zoomMax?: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoom: (v: number) => void;
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

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({ zoom, zoomMin, zoomMax, onZoomIn, onZoomOut, onZoom }: ZoomControlsProps) => {
    const lang = useContext(LangContext);
    const onZoomSliderChange = (e: React.ChangeEvent<{}>, v: number | number[]) => {
        onZoom(typeof v === 'number' ? v : v[0]);
    };
    const max = zoomMax || ZOOM_MAXIMUM;
    const min = zoomMin || ZOOM_MINIMUM;
    const step = (max - min) / SLIDER_STEP_COUNT;
    return (
        <React.Fragment>
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
            <Box ml={2} maxWidth="120px" width="100%">
                <Slider value={zoom}
                    step={step}
                    min={min}
                    max={max}
                    onChange={onZoomSliderChange}
                />
            </Box>
        </React.Fragment>
    );
}, (prevProps: ZoomControlsProps, nextProps: ZoomControlsProps) => {
    return prevProps.zoom === nextProps.zoom &&
        prevProps.zoomMax === nextProps.zoomMax &&
        prevProps.zoomMin === nextProps.zoomMin;
}));