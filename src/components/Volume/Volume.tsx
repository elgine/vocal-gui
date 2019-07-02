import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ButtonProps } from '../Button/Button';
import { PopoverPosition } from '../Popover/Popover';
import Slider from '../Slider';
import {
    FiVolume,
    FiVolumeX,
    FiVolume1,
    FiVolume2
} from 'react-icons/fi';
import TooltipButton from '../Button/TooltipButton';
import { Row } from '../Grid';

export interface VolumeProps extends Omit<ButtonProps, 'onChange'>{
    anchorPos?: PopoverPosition;
    transformPos?: PopoverPosition;
    max?: number;
    value?: number;
    iconSize?: number;
    onChange?: (v: number) => void;
}

export default React.forwardRef(({ anchorPos, transformPos, iconSize, max, value, onChange, ...others }: VolumeProps, ref: React.Ref<any>) => {
    const ma = max || 100;
    const v = value || 100;
    const p = v / ma;

    const onVolumeBtnClick = (e: React.MouseEvent<HTMLElement>) => {
        onChange && onChange(0);
    };
    return (
        <Row gutter="md">
            <TooltipButton tooltip={v > 0 ? 'Muted' : 'Unmuted'} ref={ref} onClick={onVolumeBtnClick} flat {...others}>
                {
                    v === 0 ? (
                        <FiVolumeX size={iconSize} />
                    ) : (
                        p > 0.5 ? (
                            <FiVolume2 size={iconSize} />
                        ) : (
                            p > 0.3 ? <FiVolume1 size={iconSize} /> : <FiVolume size={iconSize} />
                        )
                    )
                }
            </TooltipButton>
            <Slider max={ma} value={v} onChange={onChange} />
        </Row>
    );
});