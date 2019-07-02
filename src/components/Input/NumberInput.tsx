import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { FiPlus, FiMinus } from 'react-icons/fi';
import combineClassNames from '../../utils/combineClassNames';
import { fade } from '../utils/color';
import vertialAlign from '../mixins/verticalAlign';
import placeholder from '../mixins/placeholder';

const PREFIX_ICON_SIZE = 24;

const numberInputSizeStyle = (common: ComponentProperties, size: ComponentSize) => {
    const borderRadius = common.borderRadius[size];
    const padding = common.padding[size];
    const height = common.height[size];
    return {
        borderRadius: `${borderRadius}px`,
        '.number-input-inner': {
            padding: `0 ${height * 0.5}px 0 ${padding}px`,
            height: `${height}px`,
            borderRadius: `${borderRadius}px`
        },
        '.number-input-prefix': {
            left: `${padding}px`
        },
        '.number-input-subfix': {
            width: `${height * 0.5}px`
        },
        '&.number-input-with-prefix': {
            paddingLeft: `${PREFIX_ICON_SIZE + padding * 2}px`
        }
    };
};

const numberInputStyles = (theme: Theme): any => {
    const borderColor = theme.palette.border.border;
    const contrast = theme.palette.typography.body;
    return {
        display: 'inline-block',
        position: 'relative',
        '&.number-input-block': {
            display: 'block'
        },
        '.number-input-prefix': {
            position: 'absolute',
            height: '100%',
            width: PREFIX_ICON_SIZE,
            overflow: 'hidden',
            ...vertialAlign()
        },
        '.number-input-subfix': {
            position: 'absolute',
            top: '0',
            height: '100%',
            right: '0',
            borderLeft: `1px solid ${borderColor}`,
            boxSizing: 'border-box',
            '.number-input-subfix-btn': {
                position: 'relative',
                display: 'block',
                boxSizing: 'border-box',
                width: '100%',
                height: '50%',
                borderBottom: `1px solid ${borderColor}`,
                textAlign: 'center',
                cursor: 'pointer',
                ...vertialAlign(),
                'svg': {
                    width: '12px'
                },
                '&:hover': {
                    backgroundColor: fade(contrast, 0.04)
                },
                '&:active': {
                    backgroundColor: fade(contrast, 0.08)
                },
                '&:last-child': {
                    borderBottom: '0'
                }
            }
        },
        '.number-input-inner': {
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
        '&.number-input-size-sm': numberInputSizeStyle(theme.components.common, 'sm'),
        '&.number-input-size-md': numberInputSizeStyle(theme.components.common, 'md'),
        '&.number-input-size-lg': numberInputSizeStyle(theme.components.common, 'lg')
    };
};

export interface NumberInputProps extends BaseComponentProps{
    type?: string;
    placeholder?: string;
    size?: ComponentSize;
    value?: number;
    step?: number;
    prefix?: React.ReactNode;
    block?: boolean;
    width?: number;
    disabled?: boolean;
    onChange?: (v: number) => void;
    onEnter?: (v: number) => void;
    onEsc?: (v: number) => void;
    onBlur?: (v: number) => void;
}

export default ({
    type, placeholder, value, step, size, prefix, disabled, block, width,
    onChange, onEnter, onEsc, onBlur, className, ...others
}: NumberInputProps) => {
    const v = value || 0;
    const st = step || 0.1;
    const w = width || 120;
    const onMinusBtnClick = () => {
        if (disabled) return;
        onChange && onChange(v - st);
    };
    const onPlusBtnClick = () => {
        if (disabled) return;
        onChange && onChange(v + st);
    };
    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            onEnter && onEnter(v);
        } else if (e.keyCode === 27) {
            onEsc && onEsc(v);
        }
    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (/^\d+(\.\d+)?$/.test(e.target.value)) {
            onChange && onChange(Number(e.target.value));
        }
    };
    return (
        <div css={numberInputStyles} className={
            combineClassNames(
                `number-input-size-${size || 'md'}`,
                disabled ? 'number-input-disabled' : '',
                block ? 'number-input-block' : '',
                prefix ? 'number-input-with-prefix' : '',
                className
            )
        } {...others}>
            <input type={type} placeholder={placeholder} className="number-input-inner" style={{ width: `${w}px` }}
                value={String(v)} onChange={onInputChange} onKeyDown={onInputKeyDown}
            />
            {
                prefix ? (
                    <div className="number-input-prefix">
                        {prefix}
                    </div>
                ) : undefined
            }
            <div className="number-input-subfix">
                <div className="number-input-subfix-btn" onClick={onMinusBtnClick}>
                    <FiMinus />
                </div>
                <div className="number-input-subfix-btn" onClick={onPlusBtnClick}>
                    <FiPlus />
                </div>
            </div>
        </div>
    );
};