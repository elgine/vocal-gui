import React, { useContext } from 'react';
import { IconButton, Box, Slider, Tooltip } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { VolumeDown, VolumeMute, VolumeOff, VolumeUp } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';

export interface VolumeProps extends Omit<BoxProps, 'onChange'>{
    value?: number;
    onChange?: (v: number) => void;
}

export default ({ value, onChange }: VolumeProps) => {
    const lang = useContext(LangContext);
    const v = value || 0;
    const onValChange = (e: React.ChangeEvent<{}>, v: number | number[]) => {
        onChange && onChange(typeof v === 'number' ? v : v[0]);
    };
    return (
        <Box display="flex" alignItems="center">
            <Tooltip title={getLang(v <= 0 ? 'MUTED' : 'UNMUTED', lang)}>
                <IconButton>
                    {
                        v <= 0 ? (<VolumeOff />) : (
                            v < 0.5 ? (v < 0.2 ? <VolumeMute /> : <VolumeDown />) : <VolumeUp />
                        )
                    }
                </IconButton>
            </Tooltip>
            <Box ml={1}>
                <Slider value={v} onChange={onValChange} style={{ minWidth: '120px' }} />
            </Box>
        </Box>
    );
};