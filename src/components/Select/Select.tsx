import React, { useRef, useState } from 'react';
/** @jsx jsx */
import { jsx, keyframes } from '@emotion/core';
import Popover from '../Popover';
import { List } from '../List';
import { ListProps } from '../List/List';
import combineClassNames from '../../utils/combineClassNames';
import verticalAlign from '../mixins/verticalAlign';
import { shade } from '../utils/color';

export { ListItem as Option, ListItemHeader as OptionGroupHeader } from '../List';

const selectSizeStyle = (common: ComponentProperties, size: ComponentSize) => {
    return {
        '.select-value-box': {
            padding: `0 ${common.padding[size]}px`,
            height: `${common.height[size]}px`,
            borderRadius: `${common.borderRadius[size]}px`
        }
    };
};

const selectStyles = (theme: Theme): any => {
    return {
        boxSizing: 'border-box',
        display: 'inline-block',
        position: 'relative',
        verticalAlign: 'middle',
        '.select-block': {
            display: 'block'
        },
        '.select-value-box': {
            ...verticalAlign(),
            boxSizing: 'border-box',
            border: `1px solid ${theme.palette.border.border}`,
            '&:hover': {
                cursor: 'text',
                borderColor: `${shade(theme.palette.border.border, theme.palette.action.shade.hover)}`
            }
        },
        '&.select-active': {
            '.select-value-box': {
                borderColor: theme.palette.primary.color
            }
        },
        '&.select-size-sm': selectSizeStyle(theme.components.common, 'sm'),
        '&.select-size-md': selectSizeStyle(theme.components.common, 'md'),
        '&.select-size-lg': selectSizeStyle(theme.components.common, 'lg')
    };
};

export interface SelectProps extends ListProps{
    size?: ComponentSize;
    width?: number;
    block?: boolean;
}

export default ({ className, style, width, block, size, multiple, value, ...others }: React.PropsWithChildren<SelectProps>) => {
    const val = value || {};
    const w = width || 120;
    const containerRef = useRef<HTMLDivElement>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    let combinedStyle: React.CSSProperties = {
        ...style
    };
    if (!block) {
        combinedStyle.width = `${w}px`;
    }
    return (
        <div ref={containerRef} css={selectStyles} className={combineClassNames(
            `select-size-${size || 'md'}`,
            block ? 'select-block' : '',
            dropdownVisible ? 'select-active' : '',
            className
        )} style={combinedStyle} onClick={() => setDropdownVisible(!dropdownVisible)}>
            <div className="select-value-box">
                {
                    Object.values(val).join(',')
                }
            </div>
            <Popover visible={dropdownVisible} onClose={() => setDropdownVisible(false)}
                anchorEl={containerRef.current} anchorPos={{ vertical: 'bottom', horizontal: 'center' }}
                transformPos={{ vertical: 'top', horizontal: 'center' }}>
                <List value={value} multiple={multiple} {...others} />
            </Popover>
        </div>
    );
};