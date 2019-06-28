import React, { useEffect, useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import Popover from '../Popover';
import Button from '../Button';
import { ButtonProps } from '../Button/Button';
import { PopoverPosition } from '../Popover/Popover';
import Slider from '../Slider';
import {
    FiVolume,
    FiVolumeX,
    FiVolume1,
    FiVolume2
} from 'react-icons/fi';

export interface VolumeProps extends Omit<ButtonProps, 'onChange'>{
    anchorPos?: PopoverPosition;
    transformPos?: PopoverPosition;
    vertical?: boolean;
    min?: number;
    max?: number;
    value?: number;
    iconSize?: number;
    onChange?: (v: number) => void;
}

const volumePopoverStyles = (theme: Theme) => {
    return {
        padding: `${theme.spacing.md}px ${theme.spacing.md}px`
    };
};

export default ({ vertical, anchorPos, transformPos, iconSize, min, max, value, onChange, ...others }: VolumeProps) => {
    const mi = min || 0;
    const ma = max || 100;
    const v = value || 100;
    const p = (v - mi) / (ma - mi);

    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const onVolumeBtnClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchor(e.target as HTMLElement);
        setPopoverVisible(!popoverVisible);
    };
    return (
        <React.Fragment>
            <Button onClick={onVolumeBtnClick} flat {...others}>
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
            </Button>
            <Popover onClose={() => setPopoverVisible(false)} visible={popoverVisible}
                anchorEl={anchor} anchorPos={anchorPos} transformPos={transformPos}>
                <div css={volumePopoverStyles}>
                    <Slider vertical={vertical} min={mi} max={ma} value={v} onChange={onChange} />
                </div>
            </Popover>
        </React.Fragment>
    );
};