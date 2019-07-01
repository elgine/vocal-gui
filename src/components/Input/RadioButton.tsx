import React from 'react';
import { merge } from 'lodash';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdRadioButtonUnchecked, MdRadioButtonChecked } from 'react-icons/md';
import verticalAlign from '../mixins/verticalAlign';
import gutter from '../mixins/gutter';

const radioButtonStyles = (theme: Theme): any => {
    return {
        position: 'relative',
        ...merge(
            verticalAlign(),
            gutter(theme.spacing.sm)
        )
    };
};

export interface RadioButtonProps extends Omit<React.HTMLAttributes<{}>, 'onChange'>{
    value?: string|number;
    checked?: boolean;
    label?: string;
    iconSize?: string;
    onChange?: (v: string | number) => void;
}

export default ({ value, checked, label, iconSize, onChange, ...others }: RadioButtonProps) => {
    const onInputChange = (e: React.ChangeEvent) => {
        onChange && onChange(value || '');
    };
    return (
        <label css={radioButtonStyles} {...others}>
            {
                checked ? <MdRadioButtonChecked size={iconSize} /> : <MdRadioButtonUnchecked size={iconSize} />
            }
            {label}
            <input type="radio" hidden checked={checked} value={value} onChange={onInputChange} />
        </label>
    );
};