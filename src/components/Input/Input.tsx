import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';
import vertialAlign from '../mixins/verticalAlign';
import placeholder from '../mixins/placeholder';

const PREFIX_SUBFIX_ICON_SIZE = 24;

const inputSizeStyle = (common: ComponentProperties, size: ComponentSize) => {
    const borderRadius = common.borderRadius[size];
    const padding = common.padding[size];
    const height = common.height[size];
    return {
        borderRadius: `${borderRadius}px`,
        '.input-inner': {
            padding: `0 ${height * 0.5}px 0 ${padding}px`,
            height: `${height}px`,
            borderRadius: `${borderRadius}px`
        },
        '.input-prefix': {
            left: `${padding}px`
        },
        '.input-subfix': {
            right: `${padding}px`
        },
        '&.input-with-prefix': {
            paddingLeft: `${PREFIX_SUBFIX_ICON_SIZE + padding * 2}px`
        },
        '&.input-with-subfix': {
            paddingRight: `${PREFIX_SUBFIX_ICON_SIZE + padding * 2}px`
        }
    };
};

const inputStyles = (theme: Theme): any => {
    const borderColor = theme.palette.border.border;
    return {
        position: 'relative',
        display: 'inline-block',
        boxSizing: 'border-box',
        '&.input-block': {
            display: 'block',
            '.input-inner': {
                width: '100%'
            }
        },
        '.input-inner': {
            outline: 'none',
            boxSizing: 'border-box',
            border: `1px solid ${borderColor}`,
            background: 'none',
            color: theme.palette.typography.body,
            transition: `200ms ${theme.transitions.easeInSine} border-color`,
            '&:hover, &:focus': {
                borderColor: theme.palette.primary.color
            },
            ...placeholder(theme.palette.typography.placeholder)
        },
        '.input-prefix, .input-subfix': {
            position: 'absolute',
            top: '0',
            height: '100%',
            width: `${PREFIX_SUBFIX_ICON_SIZE}px`,
            overflow: 'hidden',
            ...vertialAlign()
        },
        '&.input-size-sm': inputSizeStyle(theme.components.common, 'sm'),
        '&.input-size-md': inputSizeStyle(theme.components.common, 'md'),
        '&.input-size-lg': inputSizeStyle(theme.components.common, 'lg')
    };
};

export interface InputProps extends BaseComponentProps{
    type?: string;
    placeholder?: string;
    size?: ComponentSize;
    width?: number;
    value?: string;
    disabled?: boolean;
    block?: boolean;
    onChange?: (v: string) => void;
    onEnter?: (v: string) => void;
    onBlur?: (v: string) => void;
    onEsc?: (v: string) => void;
    multiple?: boolean;
    prefix?: React.ReactNode;
    subfix?: React.ReactNode;
}

export default ({
    type, placeholder, size, width, value, disabled, block, multiple, prefix, subfix,
    onChange, onEnter, onBlur, onEsc, className, ...others
}: InputProps) => {
    const v = value || '';
    const w = width || 200;
    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            onEnter && onEnter(v);
        } else if (e.keyCode === 27) {
            onEsc && onEsc(v);
        }
    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value);
    return (
        <div css={inputStyles} className={
            combineClassNames(
                `input-size-${size || 'md'}`,
                disabled ? 'input-disabled' : '',
                block ? 'input-block' : '',
                prefix ? 'input-with-prefix' : '',
                subfix ? 'input-with-subfix' : '',
                className
            )
        } {...others}>
            <input type={type} placeholder={placeholder} className="input-inner" style={block ? undefined : { width: `${w}px` }}
                value={v} onChange={onInputChange} onKeyDown={onInputKeyDown}
            />
            {
                prefix ? (
                    <div className="input-prefix">
                        {prefix}
                    </div>
                ) : undefined
            }
            {
                subfix ? (
                    <div className="input-subfix">
                        {subfix}
                    </div>
                ) : undefined
            }
        </div>
    );
};