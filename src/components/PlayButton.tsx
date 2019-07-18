import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { PlayArrow, Stop } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';

export interface PlayButtonProps extends Omit<IconButtonProps, 'onChange' | 'value'>{
    value?: boolean;
    onChange?: (v: boolean) => void;
}

export default ({ value, onChange, ...others }: PlayButtonProps) => {
    const lang = useContext(LangContext);
    const onClick = (e: React.MouseEvent) => {
        onChange && onChange(!value);
    };
    return (
        <Tooltip title={getLang(value ? 'STOP' : 'START', lang)}>
            <div>
                <IconButton {...others} onClick={onClick}>
                    {
                        value ? <Stop /> : <PlayArrow />
                    }
                </IconButton>
            </div>
        </Tooltip>
    );
};