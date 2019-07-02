import React, { useState, useRef, useEffect } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { MdEdit } from 'react-icons/md';
import verticalAlign from '../mixins/verticalAlign';
import combineClassNames from '../../utils/combineClassNames';
import ClickOutside from '../ClickOutside';

const editiableTextSizeStyle = (common: ComponentProperties, size: ComponentSize) => {
    return {
        input: {
            height: `${common.height[size]}px`,
            padding: `0 ${common.padding[size]}px`,
            borderRadius: `${common.borderRadius[size]}px`
        }
    };
};

const editableTextStyles = (theme: Theme): any => {
    return {
        display: 'inline-block',
        ...verticalAlign(),
        input: {
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent',
            boxSizing: 'border-box',
            textAlign: 'center',
            color: theme.palette.typography.body,
            border: `1px solid transparent`
        },
        '.edit-icon': {
            opacity: 0
        },
        '&.editing': {
            cursor: 'default',
            input: {
                transition: `0.2s ${theme.transitions.easeOutSine} all`,
                backgroundColor: theme.palette.mask.dark,
                borderColor: theme.palette.primary.color
            }
        },
        '&:not(.editing)': {
            cursor: 'pointer',
            input: {
                cursor: 'pointer'
            },
            '&:hover': {
                '.edit-icon': {
                    opacity: 1
                }
            }
        },
        '&.disabled': {
            cursor: 'not-allowed',
            opacity: theme.palette.action.fade.disabled
        },
        '&.size-sm': editiableTextSizeStyle(theme.components.common, 'sm'),
        '&.size-md': editiableTextSizeStyle(theme.components.common, 'md'),
        '&.size-lg': editiableTextSizeStyle(theme.components.common, 'lg')
    };
};

export interface EditableTextProps extends Omit<React.HTMLAttributes<{}>, 'disabled' | 'onChange'>{
    disabled?: boolean;
    value?: string;
    size?: ComponentSize;
    onChange?: (v: string) => void;
}

export default ({ value, size, onChange, disabled, className, ...others }: EditableTextProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [editing, setEditing] = useState(false);
    const onClick = () => {
        if (disabled) return;
        setEditing(true);
    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(e.target.value);
    };
    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing, inputRef.current]);
    return (
        <ClickOutside onClick={onClick} onClickOutside={() => setEditing(false)} css={editableTextStyles} className={
            combineClassNames(
                `size-${size || 'md'}`,
                disabled ? 'disabled' : '',
                editing ? 'editing' : '',
                className
            )
        } {...others}>
            <input ref={inputRef} readOnly={!editing} disabled={disabled} value={value}
                size={value ? value.length : 5}
                maxLength={30}
                onChange={onInputChange}
            />
            &nbsp;
            <MdEdit className="edit-icon" />
        </ClickOutside>
    );
};