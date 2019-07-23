import React, { useContext, useEffect, useState } from 'react';
import { IconButton, Box, Slider, Tooltip } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { VolumeDown, VolumeMute, VolumeOff, VolumeUp } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';
import { VOLUME_MINIMUM, VOLUME_MAXIMUM, SLIDER_STEP_COUNT } from '../constant';

export interface VolumeProps extends Omit<BoxProps, 'onChange'>{
    value?: number;
    onChange?: (v: number) => void;
}

export default ({ value, onChange }: VolumeProps) => {
    const lang = useContext(LangContext);
    const v = value || 0;
    const [lastValue, setLastValue] = useState(0);
    const onValChange = (e: React.ChangeEvent<{}>, v: number | number[]) => {
        onChange && onChange(typeof v === 'number' ? v : v[0]);
    };
    const onMuteBtnClick = () => {
        if (v > 0) {
            setLastValue(v);
            onChange && onChange(0);
        } else {
            onChange && onChange(lastValue);
        }
    };
    return (
        <Box display="flex" alignItems="center">
            <Tooltip title={getLang(v <= 0 ? 'MUTED' : 'UNMUTED', lang)}>
                <IconButton onClick={onMuteBtnClick}>
                    {
                        v <= 0 ? (<VolumeOff />) : (
                            v < 0.5 ? (v < 0.2 ? <VolumeMute /> : <VolumeDown />) : <VolumeUp />
                        )
                    }
                </IconButton>
            </Tooltip>
            <Box ml={1}>
                <Slider step={(VOLUME_MAXIMUM - VOLUME_MINIMUM) / SLIDER_STEP_COUNT}
                    min={VOLUME_MINIMUM} max={VOLUME_MAXIMUM} value={v}
                    valueLabelDisplay="auto"
                    onChange={onValChange} style={{ minWidth: '120px' }}
                />
            </Box>
        </Box>
    );
};