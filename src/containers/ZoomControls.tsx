import React, { useContext } from 'react';
import { connect, useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Box, Slider, IconButton, Tooltip } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';
import { ZOOM_MINIMUM, ZOOM_MAXIMUM, SLIDER_STEP_COUNT } from '../constant';
import { ACTION_ZOOM_IN, ACTION_ZOOM_OUT, ACTION_ZOOM } from '../store/models/timeline/types';
import { RematchDispatch } from '@rematch/core';

export interface ZoomControlsProps{
    // zoom: number;
    onZoom: (v: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

const mapStateToProps = (state: any) => {
    return {
        zoom: state.timeline.zoom
    };
};

export default React.memo(() => {
    const lang = useContext(LangContext);
    const dispatch = useDispatch<RematchDispatch>();
    const { zoom } = useSelector(mapStateToProps, shallowEqual);
    const onZoomIn = dispatch.timeline[ACTION_ZOOM_IN];
    const onZoomOut = dispatch.timeline[ACTION_ZOOM_OUT];
    const onZoom = dispatch.timeline[ACTION_ZOOM];
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
}, () => true);