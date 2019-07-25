import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Slider, IconButton, Tooltip } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';
import { ZOOM_MINIMUM, ZOOM_MAXIMUM, SLIDER_STEP_COUNT } from '../constant';
import { ACTION_ZOOM_IN, ACTION_ZOOM_OUT, ACTION_ZOOM } from '../store/models/timeline/types';
import { RematchDispatch } from '@rematch/core';

export interface ZoomControlsProps{
    zoomMin?: number;
    zoomMax?: number;
}

const mapStateToProps = (state: any) => {
    return {
        zoom: state.timeline.zoom
    };
};

export default React.memo(({ zoomMin, zoomMax }: ZoomControlsProps) => {
    const { zoom } = useSelector(mapStateToProps);
    const dispatch = useDispatch<RematchDispatch>();
    const onZoomIn = dispatch.timeline[ACTION_ZOOM_IN];
    const onZoomOut = dispatch.timeline[ACTION_ZOOM_OUT];
    const onZoom = dispatch.timeline[ACTION_ZOOM];

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
}, () => true);