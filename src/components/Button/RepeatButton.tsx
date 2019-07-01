import React from 'react';
import { MdRepeatOne, MdRepeat } from 'react-icons/md';
import Button, { ButtonProps } from './Button';
import Tooltip from '../Tooltip';

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
        <Tooltip transformPos={{ horizontal: 'center', vertical: 'bottom' }}
            anchorPos={{ horizontal: 'center', vertical: 'top' }}
            title={active ? 'Repeat' : 'No repeat'}>
            <Button onClick={onBtnClick} {...others}>
                {
                    active ? <MdRepeatOne size={iconSize} /> : <MdRepeat size={iconSize} />
                }
            </Button>
        </Tooltip>
    );
};