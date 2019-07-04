import React, { useRef, useState, useEffect, useCallback, ReactElement } from 'react';
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

export interface TooltipProps extends Omit<PopoverProps, 'theme' | 'anchorEl'>{
    title?: string;
    desc?: string;
    children?: ReactElement;
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

export default ({ title, desc, children, ...others }: TooltipProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const uid = useRef(uuid());
    const onOpen = useCallback(() => title && setShowTooltip(true), [title]);
    const onClose = useCallback(() => setShowTooltip(false), []);
    const [timer, setTimer] = useState(-1);
    useEffect(() => {
        generateGlobalTooltipPopover({
            visible: showTooltip,
            anchorEl: anchorEl,
            children: (
                <div css={tooltipStyles}>
                    <div>{title}</div>
                    {desc ? <div>{desc}</div> : undefined}
                </div>
            ),
            ...others
        }, uid.current);
    }, [showTooltip, anchorEl, uid.current, onOpen, title, desc, others]);

    if (!children) return null;
    const { onMouseOver, onMouseOut } = children.props;
    const onMouseOverWrapped = (e: React.MouseEvent) => {
        clearTimeout(timer);
        setAnchorEl(e.target as HTMLElement);
        onOpen();
        onMouseOver && onMouseOver(e);
    };
    const closeTooltip = useCallback(() => {
        setTimer(window.setTimeout(() => {
            setAnchorEl(null);
            onClose();
        }, DELTA_DURATION_CLOSE_TOOLTIP));
    }, [onClose]);
    const onMouseOutWrapped = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (container && (container === el || container.contains(el))) {
            return;
        }
        closeTooltip();
        onMouseOut && onMouseOut(e);
    };

    return React.cloneElement(children, {
        onMouseOver: onMouseOverWrapped,
        onMouseOut: onMouseOutWrapped
    });
};