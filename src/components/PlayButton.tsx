import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { PlayArrow, Stop } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';

export interface PlayButtonProps extends Omit<ButtonProps, 'onChange' | 'value'>{
    value?: boolean;
    onChange?: (v: boolean) => void;
}

export default ({ value, onChange }: PlayButtonProps) => {
    const lang = useContext(LangContext);
    const onClick = (e: React.MouseEvent) => {
        onChange && onChange(!value);
    };
    return (
        <Tooltip title={getLang(value ? 'STOP' : 'PLAY', lang)}>
            <div>
                <IconButton onClick={onClick}>
                    {
                        value ? <Stop /> : <PlayArrow />
                    }
                </IconButton>
            </div>
        </Tooltip>
    );
};