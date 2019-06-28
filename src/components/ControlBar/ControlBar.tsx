import React, { useState, useEffect, useRef } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FiMoreVertical } from 'react-icons/fi';
import verticalAlign from '../mixins/verticalAlign';
import combineClassNames from '../../utils/combineClassNames';
import gutter from '../mixins/gutter';
import Button from '../Button';
import Popover from '../Popover';
import useResize from '../../hooks/useResize';
import { List, ListItem } from '../List';

const DELTA_PLACEHOLDER_LEFT = 5;

const controlBarStyles = (theme: Theme): any => {
    return {
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        '.controlbar-left, .controlbar-right': {
            whiteSpace: 'nowrap',
            ...verticalAlign()
        },
        '.controlbar-placeholder': {
            flex: 1
        },
        '&.gutter-sm': gutter(theme.spacing.sm),
        '&.gutter-md': gutter(theme.spacing.md),
        '&.gutter-lg': gutter(theme.spacing.lg),
        '&.spacing-sm': {
            padding: `0 ${theme.spacing.sm}px`
        },
        '&.spacing-md': {
            padding: `0 ${theme.spacing.md}px`
        },
        '&.spacing-lg': {
            padding: `0 ${theme.spacing.lg}px`
        }
    };
};

export interface ControlBarProps<T> extends Omit<React.HTMLAttributes<{}>, 'css'>{
    gutter?: ComponentSize;
    spacing?: ComponentSize;
    items: {left: T[]; more: T[]; right: T[]};
    renderItem: (item: any) => React.ReactNode;
    renderMoreItem: (item: any) => React.ReactNode;
}

function ControlBar<T>({ gutter, spacing, className, items, renderItem, renderMoreItem, ...others }: ControlBarProps<T>) {
    let combinedClassName = combineClassNames(
        `gutter-${gutter || 'md'}`,
        `spacing-${spacing || 'md'}`,
        className
    );

    const is = items || { left: [], more: [], right: [] };

    const moreMenuRef = useRef<HTMLUListElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const moreRef = useRef<HTMLButtonElement>(null);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const onMoreClick = () => {
        setShowMoreMenu(!showMoreMenu);
    };

    const [leftItems, setLeftItems] = useState<T[]>(is.left);
    const [rightItems, setRightItems] = useState<T[]>(is.right);
    const [moreItems, setMoreItems] = useState<T[]>(is.more);

    useEffect(() => {
        setLeftItems(is.left);
        setRightItems(is.right);
        setMoreItems(is.more);
    }, [is]);

    const pageSize = useResize(containerRef.current);
    useEffect(() => {
        if (containerRef.current && moreMenuRef.current) {
            let left = containerRef.current.getElementsByClassName('controlbar-left')[0] as HTMLElement;
            let placeholder = containerRef.current.getElementsByClassName('controlbar-placeholder')[0] as HTMLElement;
            if (left && placeholder) {
                const moreChildren = moreMenuRef.current.children;
                const moreMinChildCount = is.more.length;
                const leftMinChildCount = is.left.length;
                const newMoreItems = [...moreItems];
                const newLeftItems = [...leftItems];
                // Pick one from left side to more menu
                while (newLeftItems.length > leftMinChildCount && placeholder.offsetWidth <= DELTA_PLACEHOLDER_LEFT) {
                    let item = leftItems.pop();
                    if (item) { newMoreItems.push(item) }
                }
                // Pick more item to left side
                while (newMoreItems.length > moreMinChildCount &&
                    placeholder.offsetWidth > (moreChildren[newMoreItems.length - 1] as HTMLElement).offsetWidth + DELTA_PLACEHOLDER_LEFT) {
                    let item = newMoreItems.pop();
                    if (item) { newLeftItems.push(item) }
                }
                if (newLeftItems.length !== leftItems.length) {
                    setLeftItems(newLeftItems);
                }
                if (newMoreItems.length !== moreItems.length) {
                    setMoreItems(newMoreItems);
                }
            }
        }
    }, [is.more, is.left, leftItems, moreItems, containerRef.current, moreMenuRef.current, pageSize.width, pageSize.height]);

    return (
        <div ref={containerRef} css={controlBarStyles} className={combinedClassName} {...others}>
            <div className="controlbar-left">
                {
                    leftItems.map((item) => renderItem(item))
                }
            </div>
            <div className="controlbar-placeholder">
                {
                    moreItems && moreItems.length > 0 ? (
                        <React.Fragment>
                            <Button ref={moreRef} onClick={onMoreClick}>
                                <FiMoreVertical />
                            </Button>
                            <Popover visible={showMoreMenu} anchorEl={moreRef.current}
                                onClose={() => setShowMoreMenu(false)}>
                                <List ref={moreMenuRef} className="more-menu">
                                    {
                                        moreItems.map((item, index) => (
                                            <ListItem key={index}>
                                                {
                                                    renderMoreItem(item)
                                                }
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </Popover>
                        </React.Fragment>
                    ) : null
                }
            </div>
            <div className="controlbar-right">
                {
                    rightItems.map((item) => renderItem(item))
                }
            </div>
        </div>
    );
}

export default ControlBar;