import React from 'react';
import {
    MdPlayArrow,
    MdPause
} from 'react-icons/md';
import Button, { ButtonProps } from './Button';
import Tooltip from '../Tooltip';

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
        <Tooltip transformPos={{ horizontal: 'center', vertical: 'bottom' }}
            anchorPos={{ horizontal: 'center', vertical: 'top' }}
            title={active ? 'Stop' : 'Play'}>
            <Button onClick={onBtnClick} {...others}>
                {
                    active ? <MdPause size={iconSize} /> : <MdPlayArrow size={iconSize} />
                }
            </Button>
        </Tooltip>
    );
};