import React from 'react';
import {
    MdPlayArrow,
    MdPause
} from 'react-icons/md';
import { ButtonProps } from '../components/Button/Button';
import TooltipButton from '../components/Button/TooltipButton';

export interface PlayButtonProps extends Omit<ButtonProps, 'onChange'>{
    iconSize?: number;
    active?: boolean;
    onChange?: (v: boolean) => void;
}

export default ({ active, iconSize, onChange, onClick, ...others }: PlayButtonProps) => {
    const onBtnClick = (e: React.MouseEvent) => {
        onChange && onChange(!active);
        onClick && onClick(e);
    };
    return (
        <TooltipButton tooltip={active ? 'Stop' : 'Play'} onClick={onBtnClick} {...others}>
            {
                active ? <MdPause size={iconSize} /> : <MdPlayArrow size={iconSize} />
            }
        </TooltipButton>
    );
};