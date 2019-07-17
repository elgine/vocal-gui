import React, { useContext } from 'react';
import {
    Toolbar, IconButton, Tooltip, Collapse,  Divider,
    TextField, InputAdornment, Box, Slider
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import {
    Undo, Redo, Flip as Clip, ArrowRightAlt, ZoomIn, ZoomOut,
    OpenInNew, ArrowDropDown
} from '@material-ui/icons';
import Placeholder from '../components/Placeholder';
import { getLang, LangContext } from '../lang';
import ToggleButton from '../components/ToggleButton';
import Cursor from '../components/Cursor';
import LoadButton from '../components/LoadButton';
import { ZOOM_MINIMUM, ZOOM_MAXIMUM } from '../constant';

export interface ControlBarProps extends ToolbarProps{
    cliping?: boolean;
    clipRegion?: {start: number; end: number};
    onClipingChange?: (v: boolean) => void;
    onRegionChange?: (v: {start: number; end: number}) => void;
    onLoadSource?: (v: {type: SourceType; value?: string| File}) => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    zoom?: number;
    zoomMin?: number;
    zoomMax?: number;
    onZoom?: (v: number) => void;
}

export default ({
    cliping, clipRegion, onClipingChange, zoom, zoomMin, zoomMax,
    onRegionChange, onRedo, onUndo, onZoomIn, onZoomOut, onZoom,
    onLoadSource,
    ...others
}: ControlBarProps) => {
    const lang = useContext(LangContext);
    const r = clipRegion || { start: 0, end: 0 };
    const onZoomSliderChange = (e: React.ChangeEvent<{}>, v: number | number[]) => {
        onZoom && onZoom(typeof v === 'number' ? v : v[0]);
    };
    const onRegionStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = 0;
        if (/^\d+(\.{0,1}\d+){0,1}$/.test(e.target.value)) { v = Number(e.target.value) }
        onRegionChange && onRegionChange({ start: v * 1000, end: r.end });
    };
    const onRegionEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = 0;
        if (/^\d+(\.{0,1}\d+){0,1}$/.test(e.target.value)) { v = Number(e.target.value) }
        onRegionChange && onRegionChange({ end: v * 1000, start: r.start });
    };
    const onPointerClcik = () => {
        onClipingChange && onClipingChange(false);
    };
    const onClipModeChange = (v: boolean) => {
        onClipingChange && onClipingChange(v);
    };

    return (
        <Toolbar {...others}>
            <Tooltip title={getLang('LOAD_SOURCE_FROM', lang)}>
                <div>
                    <LoadButton onLoadSource={onLoadSource}>
                        <OpenInNew />
                        <ArrowDropDown />
                    </LoadButton>
                </div>
            </Tooltip>
            <Tooltip title={getLang('UNDO', lang)}>
                <IconButton onClick={onUndo}>
                    <Undo />
                </IconButton>
            </Tooltip>
            <Tooltip title={getLang('REDO', lang)}>
                <IconButton onClick={onRedo}>
                    <Redo />
                </IconButton>
            </Tooltip>
            <Tooltip title={getLang('POINTER', lang)}>
                <IconButton onClick={onPointerClcik}>
                    <Cursor />
                </IconButton>
            </Tooltip>
            <Tooltip title={getLang('CLIP', lang)}>
                <ToggleButton value={cliping} onChange={onClipModeChange}>
                    <Clip />
                </ToggleButton>
            </Tooltip>
            <Divider />
            <Placeholder position="relative">
                <Collapse in={cliping}>
                    <Box px={1} display="flex" alignItems="center">
                        <TextField InputProps={{
                            endAdornment: <InputAdornment position="end">{getLang('SECOND', lang)}</InputAdornment>
                        }} placeholder={getLang('START_TIME', lang)} value={r.start * 0.001} onChange={onRegionStartChange}
                        />
                        <Box px={2}><ArrowRightAlt /></Box>
                        <TextField InputProps={{
                            endAdornment: <InputAdornment position="end">{getLang('SECOND', lang)}</InputAdornment>
                        }} placeholder={getLang('END_TIME', lang)} value={r.end * 0.001} onChange={onRegionEndChange}
                        />
                    </Box>
                </Collapse>
            </Placeholder>
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
                    min={zoomMin || ZOOM_MINIMUM}
                    max={zoomMax || ZOOM_MAXIMUM}
                    onChange={onZoomSliderChange}
                />
            </Box>
        </Toolbar>
    );
};