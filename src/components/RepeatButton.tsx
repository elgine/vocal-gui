import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { Repeat, RepeatOne } from '@material-ui/icons';
import { getLang } from '../lang';
import { RootState } from '../store';

const mapLocaleStateToProps = ({ present }: RootState) => {
    return {
        ...present.locale
    };
};

export interface RepeatButtonProps extends Omit<ButtonProps, 'onChange' | 'value'>{
    value?: boolean;
    onChange?: (v: boolean) => void;
}

export default ({ value, onChange }: RepeatButtonProps) => {
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
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