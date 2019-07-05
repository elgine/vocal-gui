import React, { useRef, useState, useEffect, useCallback, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid/v4';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import Popover from '../Popover';
import { PopoverProps } from '../Popover/Popover';
import defaultTheme from '../../themes/defaultTheme';
import { contrast } from '../utils/color';

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

export interface TooltipProps extends Omit<PopoverProps, 'theme' | 'anchorEl'>{
    title?: string;
    desc?: string;
    children?: ReactElement;
    backgroundColor?: string;
}

const DELTA_DURATION_CLOSE_TOOLTIP = 1000;
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
        container.id = 'tooltip-container';
        document.body.appendChild(container);
    }

    const onCloseWrapped = () => {
        props.onClose && props.onClose();
        timer = window.setTimeout(destroyGlobalTooltipPopover, DELTA_DURATION_DESTROY_TOOLTIP);
    };

    ReactDOM.render(
        <ThemeProvider theme={defaultTheme}>
            <Popover notPortal onClose={onCloseWrapped} {...props} />
        </ThemeProvider>
        , container
    );
};

export default ({ title, desc, children, backgroundColor, style, ...others }: TooltipProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const uid = useRef(uuid());
    const [timer, setTimer] = useState(-1);
    useEffect(() => {
        let combinedStyle: React.CSSProperties = { ...style };
        if (backgroundColor) {
            combinedStyle.backgroundColor = backgroundColor;
            combinedStyle.color = contrast(backgroundColor);
        }
        generateGlobalTooltipPopover({
            visible: showTooltip,
            anchorEl: anchorEl,
            style: combinedStyle,
            children: (
                <div css={tooltipStyles}>
                    <div>{title}</div>
                    {desc ? <div>{desc}</div> : undefined}
                </div>
            ),
            ...others
        }, uid.current);
    }, [showTooltip, anchorEl, uid.current, title, desc, style, others]);

    if (!children) return null;
    const { onMouseOver, onMouseOut } = children.props;
    const onOpen = useCallback((el: HTMLElement) => {
        if (!title || title === '') return;
        clearTimeout(timer);
        setAnchorEl(el);
        setShowTooltip(true);
    }, [timer, title]);
    const onClose = useCallback(() => {
        setAnchorEl(null); setShowTooltip(false);
    }, []);
    const onMouseOverWrapped = (e: React.MouseEvent) => {
        onOpen(e.target as HTMLElement);
        onMouseOver && onMouseOver(e);
    };
    const closeDelay = useCallback(() => {
        clearTimeout(timer);
        setTimer(window.setTimeout(onClose, DELTA_DURATION_CLOSE_TOOLTIP));
    }, [onClose, timer]);
    const onMouseOutWrapped = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (container && (container === el || container.contains(el))) {
            return;
        }
        closeDelay();
        onMouseOut && onMouseOut(e);
    };

    return React.cloneElement(children, {
        onMouseOver: onMouseOverWrapped,
        onMouseOut: onMouseOutWrapped
    });
};