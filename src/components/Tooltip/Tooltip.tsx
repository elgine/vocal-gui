import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid/v4';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import Popover from '../Popover';
import { PopoverProps } from '../Popover/Popover';
import defaultTheme from '../../themes/defaultTheme';

const tooltipStyles = (theme: Theme): any => {
    const p = theme.components.common.padding.sm;
    const tooltipStyle = theme.components.tooltip;
    return {
        padding: `${p * 0.5}px ${p}px`,
        borderRadius: `${theme.components.common.borderRadius.md}px`,
        backgroundColor: tooltipStyle.backgroundColor,
        zIndex: theme.depth.zIndex['tooltip']
    };
};

export interface TooltipProps extends Omit<PopoverProps, 'theme'>{
    title?: string;
    desc?: string;
}

const DELTA_DURATION_DESTROY_TOOLTIP = 200;

let container: HTMLElement|null = null;
let guid = '';
let timer = -1;

const destroyGlobalTooltipPopover = () => {
    if (container) {
        ReactDOM.unmountComponentAtNode(container);
    }
};

const generateGlobalTooltipPopover = ({ onClose, ...props }: any, uid: string) => {
    if (guid !== uid && !props.visible) return;
    if (props.visible) {
        guid = uid;
        clearTimeout(timer);
    }
    if (!container) {
        container = document.createElement('div');
    }

    const onCloseWrapped = () => {
        props.onClose && props.onClose();
        timer = window.setTimeout(destroyGlobalTooltipPopover, DELTA_DURATION_DESTROY_TOOLTIP);
    };

    ReactDOM.render(
        <ThemeProvider theme={defaultTheme}>
            <Popover onClose={onCloseWrapped} {...props} />;
        </ThemeProvider>
        , container
    );
};

export default ({ title, desc, children, ...others }: React.PropsWithChildren<TooltipProps>) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const uid = useRef(uuid());
    const onOpen = useCallback(() => setShowTooltip(true), []);
    const onClose = useCallback(() => setShowTooltip(false), []);
    useEffect(() => {
        generateGlobalTooltipPopover({
            visible: showTooltip,
            anchorEl: wrapperRef.current,
            children: (
                <div css={tooltipStyles}>
                    <div>{title}</div>
                    {desc ? <div>{desc}</div> : undefined}
                </div>
            ),
            ...others
        }, uid.current);
    }, [showTooltip, wrapperRef.current, uid.current, onOpen, title, desc, others]);
    return (
        <div onMouseEnter={onOpen} onMouseLeave={onClose} onClick={onClose} ref={wrapperRef}>
            {children}
        </div>
    );
};