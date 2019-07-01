import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdMenu, MdLaunch, MdSettings, MdHelpOutline } from 'react-icons/md';
import Button from '../components/Button';
import { TitleLoader } from '../components/Loader';
import gutter from '../components/mixins/gutter';
import TooltipButton from '../components/Button/TooltipButton';

const headerStyles = (theme: Theme) => {
    return {
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${theme.spacing.md}px`,
        ...gutter(theme.spacing.sm * 0.5),
        '.header-placeholder': {
            flex: 1
        }
    };
};

export interface HeaderProps extends React.HTMLAttributes<{}>{
    onMenuClick?: React.MouseEventHandler;
    source?: {thumb?: string; title: string; author: string};
}

export default ({ onMenuClick, ...others }: HeaderProps) => {
    return (
        <div css={headerStyles} {...others}>
            {/* <Button flat onClick={onMenuClick}>
                <MdMenu />
            </Button> */}
            <TitleLoader style={{ height: '36px' }} />
            <div className="header-placeholder"></div>
            <TooltipButton flat tooltip="Help">
                <MdHelpOutline />
            </TooltipButton>
            <TooltipButton flat tooltip="Settings">
                <MdSettings />
            </TooltipButton>
            <TooltipButton>
                <MdLaunch />&nbsp;<span>Export</span>
            </TooltipButton>
        </div>
    );
};