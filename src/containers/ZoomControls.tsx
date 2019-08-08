import React, { useContext } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Box, Slider, IconButton, Tooltip } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';
import { getLang } from '../lang';
import { ZOOM_MINIMUM, ZOOM_MAXIMUM, SLIDER_STEP_COUNT } from '../constant';
import { ACTION_ZOOM_IN, ACTION_ZOOM_OUT, ACTION_ZOOM } from '../store/models/editor/types';
import { RematchDispatch } from '@rematch/core';
import { RootState, Models } from '../store';

const mapStateToProps = ({ present }: RootState) => {
    return {
        zoom: present.editor.zoom,
        lang: present.locale.lang
    };
};

export default React.memo(() => {
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const { zoom, lang } = useSelector(mapStateToProps, shallowEqual);
    const onZoomIn = dispatch.editor[ACTION_ZOOM_IN];
    const onZoomOut = dispatch.editor[ACTION_ZOOM_OUT];
    const onZoom = dispatch.editor[ACTION_ZOOM];
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
            <Box mx={3} width="128px">
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