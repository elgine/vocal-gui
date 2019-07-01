import React from 'react';
import { PopoverPosition } from '../Popover/Popover';
import Tooltip from '../Tooltip/Tooltip';
import { ButtonProps } from './Button';
import Button from '.';

const TOOLTIP_ANCHOR_POS: PopoverPosition = {
    horizontal: 'center',
    vertical: 'top'
};
const TOOLTIP_TRANSFORM_POS: PopoverPosition = {
    horizontal: 'center',
    vertical: 'bottom'
};

export interface TooltipButtonProps extends Omit<ButtonProps, 'title'>{
    tooltip?: string;
}

export default React.forwardRef(({ tooltip, ...others }: TooltipButtonProps, ref: React.Ref<any>) => {
    return (
        <Tooltip title={tooltip} anchorPos={TOOLTIP_ANCHOR_POS} transformPos={TOOLTIP_TRANSFORM_POS}>
            <Button ref={ref} {...others} />
        </Tooltip>
    );
});