import React, { useState } from 'react';
import { merge } from 'lodash';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import Button from '../Button';
import { MdLinearScale, MdAdd, MdRemove } from 'react-icons/md';
import Popover from '../Popover';
import Slider from '../Slider';
import verticalAlign from '../mixins/verticalAlign';
import gutter from '../mixins/gutter';

const timelineScaleControlStyles = (theme: Theme): any => {
    return merge({
        position: 'relative',
        whiteSpace: 'nowrap'
    }, gutter(theme.spacing.sm), verticalAlign());
};

export interface TimelineScaleControlProps{
    value?: number;
    step?: number;
    min?: number;
    max?: number;
    onValueChange?: (v: number) => void;
}

export default ({ min, max, value, step, onValueChange }: TimelineScaleControlProps) => {
    const v = value || 0;
    const mi = min || 0;
    const ma = max || 100;
    const s = step || (ma - mi) * 0.1;
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const onScaleClick = (e: React.MouseEvent) => {
        if (anchorEl !== null) { setAnchorEl(null) }
        else { setAnchorEl(e.nativeEvent.target as HTMLElement) }
    };
    const onScalePlusClick = () => onValueChange && onValueChange(v + s);
    const onScaleMinusClick = () => onValueChange && onValueChange(v - s);
    return (
        <React.Fragment>
            <Button onClick={onScaleClick} size="sm" flat>
                <MdLinearScale />
            </Button>
            <Popover anchorPos={{ horizontal: 'right', vertical: 'top' }}
                transformPos={{ horizontal: 'right', vertical: 'bottom' }}
                visible={anchorEl !== null} anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}>
                <div css={timelineScaleControlStyles}>
                    <Button flat size="sm" onClick={onScaleMinusClick}>
                        <MdRemove />
                    </Button>
                    <Slider min={mi} max={ma} value={value} onChange={onValueChange} />
                    <Button flat size="sm" onClick={onScalePlusClick}>
                        <MdAdd />
                    </Button>
                </div>
            </Popover>
        </React.Fragment>
    );
};