import React, { useState } from 'react';
import Popover from '../Popover';
import { MdLinearScale } from 'react-icons/md';
import Box from '../Grid/Box';
import Slider from '../Slider';
import { PopoverProps } from '../Popover/Popover';
import TooltipButton, { TooltipButtonProps } from '../Button/TooltipButton';

export interface TimeScaleControlsProps extends TooltipButtonProps{
    popoverProps?: PopoverProps;
}

export default ({ tooltip, popoverProps, onClick, ...others }: TimeScaleControlsProps) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const onBtnClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchor(e.target as HTMLElement);
        setPopoverVisible(!popoverVisible);
        onClick && onClick(e);
    };
    const onPopoverClose = () => {
        setPopoverVisible(false);
    };
    return (
        <React.Fragment>
            <TooltipButton tooltip={tooltip} {...others} onClick={onBtnClick}>
                <MdLinearScale />
            </TooltipButton>
            <Popover anchorEl={anchor} visible={popoverVisible}
                onClose={onPopoverClose} {...popoverProps}>
                <Box pa="md">
                    <Slider />
                </Box>
            </Popover>
        </React.Fragment>
    );
};