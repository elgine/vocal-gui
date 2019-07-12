import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { Repeat, RepeatOne } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';

export interface RepeatButtonProps extends Omit<ButtonProps, 'onChange' | 'value'>{
    value?: boolean;
    onChange?: (v: boolean) => void;
}

export default ({ value, onChange }: RepeatButtonProps) => {
    const lang = useContext(LangContext);
    const onClick = (e: React.MouseEvent) => {
        onChange && onChange(!value);
    };
    return (
        <Tooltip title={getLang(value ? 'REPEAT' : 'NO_REPEAT', lang)}>
            <div>
                <IconButton onClick={onClick}>
                    {
                        value ? <RepeatOne /> : <Repeat />
                    }
                </IconButton>
            </div>
        </Tooltip>
    );
};