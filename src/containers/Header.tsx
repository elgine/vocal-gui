import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdAdd, MdLaunch, MdSettings, MdHelpOutline } from 'react-icons/md';
import Button from '../components/Button';
import { TitleLoader } from '../components/Loader';
import gutter from '../components/mixins/gutter';
import TooltipButton from '../components/Button/TooltipButton';
import { Card, CardTitle } from '../components/Card';
import { Row, Col } from '../components/Grid';
import Avatar from '../components/Avatar';
import Box from '../components/Grid/Box';

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
    onImportBtnClick?: React.MouseEventHandler;
    iconSize?: number|string;
    source?: {thumb?: string; title: string; author: string};
    loadingSource?: boolean;
}

export default ({ onMenuClick, iconSize, loadingSource, source, onImportBtnClick, ...others }: HeaderProps) => {
    return (
        <div css={headerStyles} {...others}>
            {
                loadingSource ? (
                    <TitleLoader style={{ height: '48px' }} />
                ) : (
                    source ? (
                        <Card>
                            <Row>
                                <Col>
                                    <Avatar shape="circular" src={source.thumb} alt={source.title} />
                                </Col>
                                <Col>
                                    <CardTitle gutter="sm" title={source.title} desc={source.author} />
                                </Col>
                            </Row>
                        </Card>
                    ) : (
                        <Button onClick={onImportBtnClick}>
                            <MdAdd size={iconSize} />
                            &nbsp;
                            <span>
                                Import
                            </span>
                        </Button>
                    )
                )
            }

            <div className="header-placeholder"></div>
            <TooltipButton flat tooltip="Help">
                <MdHelpOutline size={iconSize} />
            </TooltipButton>
            <TooltipButton flat tooltip="Settings">
                <MdSettings size={iconSize} />
            </TooltipButton>
            <TooltipButton color="primary">
                <MdLaunch size={iconSize} />&nbsp;<span>Export</span>
            </TooltipButton>
        </div>
    );
};