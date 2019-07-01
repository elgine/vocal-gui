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
        '&:hover': {
            backgroundColor: listItem.backgroundColorHover
        },
        '&:active, &.list-selected': {
            backgroundColor: listItem.backgroundColorActive
        },
        '&.list-item-sm': listItemSizeStyle(common, 'sm'),
        '&.list-item-md': listItemSizeStyle(common, 'md'),
        '&.list-item-lg': listItemSizeStyle(common, 'lg')
    };
};

export interface ListItemProps extends React.LiHTMLAttributes<{}>{
    size?: ComponentSize;
    selected?: boolean;
}

export default ({ selected, size, children, className, ...others }: React.PropsWithChildren<ListItemProps>) => {
    return (
        <li css={listItemStyles}
            className={
                combineClassNames(
                    `size-${size}`,
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