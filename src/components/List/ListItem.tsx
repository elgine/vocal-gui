import React from 'react';
import combineClassNames from '../../utils/combineClassNames';

const listItemSizeStyle = (common: ComponentProperties, size: ComponentSize) => {
    return {
        padding: `0 ${common.padding[size]}px`
    };
};

const listItemStyles = (theme: Theme): any => {
    const { common, listItem } = theme.components;
    return {
        boxSizing: 'border-box',
        '&.list-disabled': {
            pointerEvents: 'none',
            opacity: theme.palette.action.disabledOpacity
        },
        '&:not(.list-disabled)': {
            '&:hover': {
                backgroundColor: listItem.backgroundColorHover
            },
            '&:active, &.list-selected': {
                backgroundColor: listItem.backgroundColorActive
            }
        },
        '&.list-item-sm': listItemSizeStyle(common, 'sm'),
        '&.list-item-md': listItemSizeStyle(common, 'md'),
        '&.list-item-lg': listItemSizeStyle(common, 'lg')
    };
};

export interface ListItemProps extends React.LiHTMLAttributes<{}>{
    value?: string;
    size?: ComponentSize;
    disabled?: boolean;
    selected?: boolean;
}

export default ({ selected, disabled, size, children, className, ...others }: React.PropsWithChildren<ListItemProps>) => {
    return (
        <li css={listItemStyles}
            className={
                combineClassNames(
                    `size-${size}`,
                    disabled ? 'list-disabled' : '',
                    selected ? 'list-selected' : '',
                    className
                )
            }
            {...others}
        >
            {children}
        </li>
    );
};