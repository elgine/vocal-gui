import React, { useState, useEffect } from 'react';
import { merge } from 'lodash';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';
import TabHeader from './TabHeader';
import vertialAlign from '../mixins/verticalAlign';
import gutter from '../mixins/gutter';

const tabsStyles = (theme: Theme): any => {
    const spacing = theme.spacing;
    const tabs = theme.components.tabs;
    return {
        position: 'relative',
        height: '100%',
        '&:not(.tabs-vertical)': {
            width: '100%',
            '.tabs-header': {
                overflowX: 'auto',
                padding: `0 ${spacing.md}px`,
                width: '100%',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                ...merge(vertialAlign(), gutter(spacing.sm))
            }
        },
        '&.tabs-vertical': {
            height: '100%',
            '.tabs-header, .tabs-content': {
                height: '100%',
                overflowY: 'auto',
                ...gutter(spacing.sm, true)
            },
            '.tabs-header': {
                width: '100%',
                padding: `${spacing.md}px 0`
            }
        },
        '.tabs-header': {
            position: 'absolute',
            left: '0',
            top: '0',
            boxSizing: 'border-box',
            fontSize: tabs.headerFontSize,
            backgroundColor: theme.palette.background.body,
            zIndex: 4
        },
        '.tabs-content': {
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
            overflowY: 'auto'
        }
    };
};

export interface TabsProps extends React.HTMLAttributes<{}>{
    vertical?: boolean;
    selected?: string;
    defaultSelected?: string;
    tabHeaderHeight?: number;
    tabHeaderWidth?: number;
    onTabChange?: (v: string) => void;
}

const renderTabHeaders = (selected: string, children: React.ReactNode, vertical: boolean, onHeaderClick: (e: React.MouseEvent<{}>, value: string) => void) => {
    return React.Children.map(children, (el: any) => {
        return (
            <TabHeader key={el.props.value} vertical={vertical} onClick={(e) => onHeaderClick(e, el.props.value)} selected={selected === el.props.value}>{el.props.title}</TabHeader>
        );
    });
};

const renderTabContent = (selected: string, children: React.ReactNode) => {
    return React.Children.map(children, (el: any) => {
        if (el.props.value === selected) {
            return el;
        }
    });
};

export default ({ selected, defaultSelected, vertical, children, tabHeaderHeight, tabHeaderWidth, className, onTabChange, ...others }: React.PropsWithChildren<TabsProps>) => {
    const thh = tabHeaderHeight || 48;
    const thw = tabHeaderWidth || 120;
    const [sel, setSel] = useState(selected || defaultSelected || '');
    useEffect(() => setSel(selected || defaultSelected || ''), [selected]);

    let tabsHeaderStyle: React.CSSProperties = {

    };
    let tabsContentStyle: React.CSSProperties = {};
    if (vertical) {
        tabsHeaderStyle.width = `${thw}px`;
        tabsContentStyle.paddingLeft = `${thw}px`;
    } else {
        tabsContentStyle.paddingTop = `${thh}px`;
        tabsHeaderStyle.height = `${thh}px`;
    }

    const onHeaderClick = (e: React.MouseEvent<{}>, value: string) => {
        onTabChange && onTabChange(value);
        if (!selected) {
            setSel(value);
        }
    };
    return (
        <div css={tabsStyles} className={
            combineClassNames(
                vertical ? 'tabs-vertical' : '',
                className
            )
        } {...others}>
            <div className="tabs-header" style={tabsHeaderStyle}>
                {renderTabHeaders(sel, children, vertical || false, onHeaderClick)}
            </div>
            <div className="tabs-content" style={tabsContentStyle}>
                {renderTabContent(sel, children)}
            </div>
        </div>
    );
};