import React from 'react';
import { MdRepeatOne, MdRepeat } from 'react-icons/md';
import Button, { ButtonProps } from './Button';
import Tooltip from '../Tooltip';
import TooltipButton from './TooltipButton';

export interface RepeatButtonProps extends Omit<ButtonProps, 'onChange'>{
    iconSize?: number;
    active?: boolean;
    onChange?: (v: boolean) => void;
}

export default ({ active, iconSize, onChange, onClick, ...others }: RepeatButtonProps) => {
    const onBtnClick = (e: React.MouseEvent) => {
        onChange && onChange(!active);
        onClick && onClick(e);
    };
    return (
        <TooltipButton tooltip={active ? 'Repeat' : 'No repeat'} onClick={onBtnClick} {...others}>
            {
                active ? <MdRepeatOne size={iconSize} /> : <MdRepeat size={iconSize} />
            }
            &nbsp;
            <span>
                {
                    active ? 'Repeat' : 'No repeat'
                }
            </span>
        </TooltipButton>
    );
};