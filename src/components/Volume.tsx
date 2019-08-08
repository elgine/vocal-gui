import React, { useContext, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { IconButton, Box, Slider, Tooltip } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { VolumeDown, VolumeMute, VolumeOff, VolumeUp } from '@material-ui/icons';
import { getLang } from '../lang';
import { VOLUME_MINIMUM, VOLUME_MAXIMUM, SLIDER_STEP_COUNT } from '../constant';
import { RootState } from '../store';

const mapLocaleStateToProps = ({ present }: RootState) => {
    return {
        ...present.locale
    };
};

export interface VolumeProps extends Omit<BoxProps, 'onChange'>{
    value?: number;
    onChange?: (v: number) => void;
}

export default React.memo(({ value, onChange }: VolumeProps) => {
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
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
}, (prevProps: VolumeProps, nextProps: VolumeProps) => {
    return prevProps.value === nextProps.value &&
        prevProps.onChange === nextProps.onChange;
});