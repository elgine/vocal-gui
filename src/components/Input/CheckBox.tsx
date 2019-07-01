import React from 'react';
import { merge } from 'lodash';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import verticalAlign from '../mixins/verticalAlign';
import gutter from '../mixins/gutter';

const checkBoxStyles = (theme: Theme): any => {
    return {
        position: 'relative',
        color: theme.palette.primary.color,
        cursor: 'pointer',
        ...merge(
            verticalAlign(),
            gutter(theme.spacing.sm)
        )
    };
};

export interface CheckBoxProps extends Omit<React.HTMLAttributes<{}>, 'onChange'>{
    value?: boolean;
    label?: string;
    iconSize?: number;
    onChange?: (v: boolean) => void;
}

export default ({ value, label, iconSize, onChange }: CheckBoxProps) => {
    const v = value || false;
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(!v);
    return (
        <label css={checkBoxStyles}>
            {
                v ? <MdCheckBox size={iconSize} /> : <MdCheckBoxOutlineBlank size={iconSize} />
            }
            {label}
            <input hidden type="checkbox" checked={v} onChange={onInputChange} />
        </label>
    );
};