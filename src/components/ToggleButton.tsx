import React from 'react';
import { Button } from '@material-ui/core';
import { IconButtonProps } from '@material-ui/core/IconButton';

export interface ToggleButtonProps extends Omit<IconButtonProps, 'value' | 'onChange'>{
    value?: boolean;
    onChange?: (v: boolean) => void;
}

export default React.forwardRef(({ value, onChange, onClick, ...others }: ToggleButtonProps, ref: React.Ref<any>) => {
    const onBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick && onClick(e);
        onChange && onChange(!value);
    };
    return (
        <Button ref={ref} color={value ? 'primary' : 'default'} onClick={onBtnClick} {...others} />
    );
});