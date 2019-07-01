import React, { useState, useEffect } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import ReactDOM from 'react-dom';
import { FiX } from 'react-icons/fi';
import Button from '../Button';
import ClickOutside from '../ClickOutside';
import { CSSTransition } from 'react-transition-group';
import verticalMiddle from '../mixins/verticalAlign';
import gutter from '../mixins/gutter';

const CLOSE_ICON_WIDTH = 24;

const modalStyles = (theme: Theme): any => {
    const radius = theme.components.common.borderRadius['lg'];
    return {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: theme.depth.zIndex['modal'],
        borderRadius: radius,
        textAlign: 'center',
        ...verticalMiddle,
        '.modal-mask': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: theme.palette.mask.dark,
        },
        '.modal-content': {
            maxWidth: '100%',
            maxHeight: '100%',
            backgroundColor: theme.palette.background.surface,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            '.modal-header, .modal-footer': {
                position: 'relative',
                boxSizing: 'border-box',
                padding: `0 ${theme.spacing.md}px`,
                ...verticalMiddle
            },
            '.modal-close': {
                position: 'absolute',
                right: `${theme.spacing.sm}px`,
                width: `${CLOSE_ICON_WIDTH}px`,
                top: '50%',
                transform: 'translateY(-50%)'
            },
            '.modal-header': {
                paddingRight: `${theme.spacing.sm * 2 + CLOSE_ICON_WIDTH}px`,
                height: `${theme.components.modal.headerHeight}px`
            },
            '.modal-header.hide-close': {
                paddingRight: `${theme.spacing.md}px`
            },
            '.modal-body': {
                padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                overflow: 'auto'
            },
            '.modal-footer': {
                textAlign: 'right',
                height: `${theme.components.modal.footerHeight}px`,
                backgroundColor: theme.palette.background.panel,
                borderBottomLeftRadius: radius,
                borderBottomRightRadius: radius,
                '.modal-footer-default-content': {
                    ...gutter(theme.spacing.sm)
                }
            }
        }
    };
};

export interface ModalProps extends React.HTMLAttributes<{}>{
    width?: number;
    visible?: boolean;
    headerTitle?: string;
    hideHeader?: boolean;
    hideFooter?: boolean;
    hideClose?: boolean;
    header?: React.ReactElement;
    footer?: React.ReactElement;
    transitionClassNames?: string | Dictionary<string>;
    onClose?: (e: MouseEvent) => void;
}

export default ({ visible, width, transitionClassNames, headerTitle, hideHeader, hideFooter, hideClose, header, footer, children, onClose, style, ...others }: React.PropsWithChildren<ModalProps>) => {
    const [show, setShow] = useState(false);
    const [transitionActive, setTransitionActive] = useState(false);
    const [transitionEnded, setTransitionEnded] = useState(false);
    useEffect(() => {
        if (visible) {
            setTransitionEnded(false);
            setShow(true);
        }
        if (!visible && transitionEnded) {
            setShow(false);
        }
        setTransitionActive(visible || false);
    }, [visible, transitionEnded]);
    console.log(show);
    return ReactDOM.createPortal(
        <div css={modalStyles} style={{ width: `${width || 640}px`, display: show ? 'block' : 'none', ...style }} {...others}>
            <CSSTransition in={transitionActive} classNames="fade" timeout={300} unmountOnExit>
                <div className="modal-mask"></div>
            </CSSTransition>
            <CSSTransition classNames={transitionClassNames || 'scale'} unmountOnExit in={transitionActive} onExited={() => setTransitionEnded(true)} timeout={300}>
                <ClickOutside className="modal-content" onClickOutside={onClose}>
                    {
                        !hideHeader ? <div className={`modal-header ${hideClose ? 'hide-close' : ''}`}>
                            {
                                header || headerTitle
                            }
                            {
                                !hideClose ? (
                                    <FiX className="modal-close" />
                                ) : undefined
                            }
                        </div> : undefined
                    }
                    <div className="modal-body">{children}</div>
                    {
                        !hideFooter ? <div className="modal-footer">
                            {
                                footer ? footer : (
                                    <div className="modal-footer-default-content">
                                        <Button>Cancel</Button>
                                        <Button color="primary">OK</Button>
                                    </div>
                                )
                            }
                        </div> : undefined
                    }
                </ClickOutside>
            </CSSTransition>
        </div>,
        document.body
    );
};