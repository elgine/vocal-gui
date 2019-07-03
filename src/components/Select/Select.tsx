import React, { useRef, useState, useMemo } from 'react';
/** @jsx jsx */
import { jsx, keyframes } from '@emotion/core';
import { MdArrowDropDown } from 'react-icons/md';
import Popover from '../Popover';
import { List } from '../List';
import { ListProps } from '../List/List';
import combineClassNames from '../../utils/combineClassNames';
import verticalAlign from '../mixins/verticalAlign';
import { shade } from '../utils/color';
import { EMPTY_DICT } from '../../constant';

export { ListItem as Option, ListItemHeader as OptionGroupHeader } from '../List';

const SUBFIX_SIZE = 20;

const selectSizeStyle = (common: ComponentProperties, size: ComponentSize) => {
    return {
        borderRadius: `${common.borderRadius[size]}px`,
        '.select-value-box': {
            padding: `0 ${SUBFIX_SIZE + common.padding[size] * 2}px 0 ${common.padding[size]}px`,
            height: `${common.height[size]}px`,
            '.select-subfix': {
                right: `${common.padding[size]}px`
            }
        }
    };
};

const selectStyles = (theme: Theme): any => {
    return {
        boxSizing: 'border-box',
        display: 'inline-block',
        position: 'relative',
        border: `1px solid ${theme.palette.border.border}`,
        '.select-block': {
            display: 'block'
        },
        '.select-value-box': {
            ...verticalAlign(),
            '.select-subfix': {
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)'
            }
        },
        '&.select-empty': {
            '.select-value-box': {
                color: theme.palette.typography.placeholder
            }
        },
        '&:not(.disabled)': {
            '&:hover': {
                cursor: 'text',
                borderColor: `${shade(theme.palette.border.border, theme.palette.action.shade.hover)}`
            },
            '&.select-active': {
                borderColor: theme.palette.primary.color,
                '.select-subfix': {
                    transform: 'translateY(-50%) rotate(180deg)'
                }
            }
        },
        '&.select-size-sm': selectSizeStyle(theme.components.common, 'sm'),
        '&.select-size-md': selectSizeStyle(theme.components.common, 'md'),
        '&.select-size-lg': selectSizeStyle(theme.components.common, 'lg')
    };
};

export interface SelectProps extends Omit<ListProps, 'value' | 'onChange' | 'multiple'>{
    value?: string;
    onChange?: (v: string) => void;
    size?: ComponentSize;
    width?: number;
    block?: boolean;
    placeholder?: string;
    renderResult?: (v: Dictionary<string>) => React.ReactNode;
}

export default ({ className, style, width, block, size, value, onChange, placeholder, renderResult, ...others }: React.PropsWithChildren<SelectProps>) => {
    const val = useMemo(() => (value ? { [value]: value } : EMPTY_DICT), [value]);
    const w = width || 120;
    const ph = placeholder || 'Select...';
    const containerRef = useRef<HTMLDivElement>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    let combinedStyle: React.CSSProperties = {
        ...style
    };
    if (!block) {
        combinedStyle.minWidth = `${w}px`;
    }

    const valArr = Object.values(val);
    const hasValue = valArr.length > 0;
    const onListSelectedChange = (v: Dictionary<string>) => {
        onChange && onChange(Object.values(v)[0]);
    };
    return (
        <div ref={containerRef} css={selectStyles} className={combineClassNames(
            `select-size-${size || 'md'}`,
            block ? 'select-block' : '',
            dropdownVisible ? 'select-active' : '',
            !hasValue ? 'select-empty' : '',
            className
        )} style={combinedStyle} onClick={() => setDropdownVisible(!dropdownVisible)}>
            <div className="select-value-box">
                {
                    renderResult ? renderResult(val) : (hasValue ? valArr.join(',') : ph)
                }
                <MdArrowDropDown className="select-subfix" size={SUBFIX_SIZE} />
            </div>
            <Popover stretch visible={dropdownVisible} onClose={() => setDropdownVisible(false)}
                anchorEl={containerRef.current} anchorPos={{ vertical: 'bottom', horizontal: 'center' }}
                transformPos={{ vertical: 'top', horizontal: 'center' }}>
                <List value={val} onChange={onListSelectedChange} {...others} />
            </Popover>
        </div>
    );
};