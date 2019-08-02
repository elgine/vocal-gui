import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Paper, Button, Portal, Fade, DialogActions, DialogTitle, DialogContent, ClickAwayListener } from '@material-ui/core';
import { fade, mix } from '../utils/color';
import useResize from '../hooks/useResize';
import { PopperPlacementType } from '@material-ui/core/Popper';
import { PaperProps } from '@material-ui/core/Paper';
import clsx from 'clsx';

const BEACON_SIZE = 36;
const BEACON_INNER_SIZE = 18;
const BEACON_PLUSE_SCALE = 1.2;

const useBeaconStyles = makeStyles((theme: Theme) => {
    const primary = theme.palette.primary[theme.palette.type];
    return {
        '@global': {
            '@keyframes pulse': {
                '0%': {
                    transform: 'scale(1)'
                },
                '55%': {
                    transform: `scale(${BEACON_PLUSE_SCALE})`
                }
            }
        },
        root: {
            position: 'absolute',
            animation: 'pulse 1s ease-in-out infinite',
            borderRadius: '50%',
            border: `2px solid ${primary}`,
            backgroundColor: fade(primary, 0.2),
            height: `${BEACON_SIZE}px`,
            width: `${BEACON_SIZE}px`,
            marginLeft: `-${BEACON_SIZE * 0.5}px`,
            marginTop: `-${BEACON_SIZE * 0.5}px`,
            display: 'inline-block'
        },
        inner: {
            position: 'absolute',
            display: 'inline-block',
            borderRadius: '50%',
            backgroundColor: primary,
            width: `${BEACON_INNER_SIZE}px`,
            height: `${BEACON_INNER_SIZE}px`,
            top: '50%',
            left: '50%',
            marginLeft: `-${BEACON_INNER_SIZE * 0.5}px`,
            marginTop: `-${BEACON_INNER_SIZE * 0.5}px`,
        }
    };
});

interface BeaconProps extends React.HTMLAttributes<{}>{

}

const Beacon = ({ className, ...others }: BeaconProps) => {
    const classes = useBeaconStyles();
    return (
        <span className={clsx(classes.root, className)} {...others}>
            <span className={classes.inner}></span>
        </span>
    );
};

const useTourDialogStyles = makeStyles((theme: Theme) => {
    const surface = theme.palette.background.paper;
    const primary = theme.palette.primary[theme.palette.type];
    return {
        root: {
            position: 'absolute',
            width: '300px',
            transition: '0.3s ease-in all',
            backgroundColor: mix(surface, primary, 0.08)
        }
    };
});

interface TourDialogProps extends PaperProps, IntroStep{
    backLabel?: string;
    nextLabel?: string;
    closeLabel?: string;
    showBackBtn?: boolean;
    showNextBtn?: boolean;
    showCloseBtn?: boolean;
    onClickBack?: React.MouseEventHandler;
    onClickNext?: React.MouseEventHandler;
    onClose: () => void;
}

const TourDialog = React.forwardRef(({
    title, content, className,
    backLabel, nextLabel, closeLabel,
    showBackBtn, showNextBtn, showCloseBtn,
    onClickBack, onClickNext, onClose,
    ...others
}: TourDialogProps, contentRef: React.Ref<any>) => {
    const classes = useTourDialogStyles();
    return (
        <ClickAwayListener onClickAway={onClose as any}>
            <Paper ref={contentRef} className={clsx(classes.root, className)} {...others}>
                {
                    title ? (
                        <DialogTitle>
                            {title}
                        </DialogTitle>
                    ) : undefined
                }
                <DialogContent>
                    {
                        content
                    }
                </DialogContent>
                <DialogActions>
                    {
                        showBackBtn ? (
                            <Button size="small" onClick={onClickBack}>
                                {
                                    backLabel || 'Back'
                                }
                            </Button>
                        ) : undefined
                    }
                    {
                        showNextBtn ? (
                            <Button variant="contained" size="small" color="primary" onClick={onClickNext}>
                                {
                                    nextLabel || 'Next'
                                }
                            </Button>
                        ) : undefined
                    }
                    {
                        showCloseBtn ? (
                            <Button color="primary" size="small" onClick={onClose}>
                                {
                                    closeLabel || 'Close'
                                }
                            </Button>
                        ) : undefined
                    }
                </DialogActions>
            </Paper>
        </ClickAwayListener>
    );
});

const useOverlayStyles = makeStyles((theme: Theme) => {
    const primary = theme.palette.primary[theme.palette.type];
    return {
        root: {
            position: 'absolute',
            boxShadow: '0 0 0 2000px transparent',
            transition: '0.3s ease-out all',
            '&.show-outline': {
                outline: `${primary} solid 5px`
            }
        }
    };
});

const Overlay = ({ className, children, showOutline, ...others }: React.HTMLAttributes<{}> & {showOutline?: boolean}) => {
    const classes = useOverlayStyles();
    return (
        <div className={clsx(classes.root, className, showOutline ? 'show-outline' : '')}
            {...others}>
            {children}
        </div>
    );
};

export interface IntroStep{
    title?: string;
    target: string;
    content: React.ReactNode;
    placement?: PopperPlacementType;
}

export interface IntroProps{
    open?: boolean;
    steps: IntroStep[];
    offset?: number;
    continous?: boolean;
    index?: number;
    onClose?: Function;
    onNext?: Function;
    onBack?: Function;
    onStepChange?: Function;
    disabledModal?: boolean;
    hideCloseBtn?: boolean;
    locale?: {
        back?: string;
        next?: string;
        close?: string;
    };
}

const positionContent = (
    style: React.CSSProperties,
    placement: PopperPlacementType,
    targetBounds: ClientRect | DOMRect,
    itemSize: {width: number; height: number},
    boundary: {width: number; height: number},
    offset: number
) => {
    const axises = placement.split('-');
    const priAxis = axises[0];
    const secAxis = axises[1];
    if (priAxis === 'left' || priAxis === 'right') {
        if (priAxis === 'left' || (priAxis === 'right' && (itemSize.width + targetBounds.right > boundary.width))) {
            style.left = targetBounds.left - offset - itemSize.width;
        } else {
            style.left = targetBounds.right + offset;
        }
        if (secAxis === 'start') {
            style.top = 0;
        } else if (secAxis === 'end') {
            style.top = targetBounds.bottom - itemSize.height;
        } else {
            style.top = targetBounds.height * 0.5 + targetBounds.top - itemSize.height * 0.5;
        }
        if (style.top < 0) {
            style.top = 0;
        }
        if (style.top + itemSize.height > boundary.height) {
            style.top = boundary.height - itemSize.height;
        }
    } else {
        if (priAxis === 'top' || (priAxis === 'bottom' && (itemSize.height + targetBounds.bottom > boundary.height))) {
            style.top = targetBounds.top - offset - itemSize.height;
        } else {
            style.top = targetBounds.bottom + offset;
        }
        if (secAxis === 'start') {
            style.left = 0;
        } else if (secAxis === 'end') {
            style.left = targetBounds.right - itemSize.width;
        } else {
            style.left = targetBounds.width * 0.5 + targetBounds.left - itemSize.width * 0.5;
        }
        if (style.left < 0) {
            style.left = 0;
        }
        if (style.left + itemSize.width > boundary.width) {
            style.left = boundary.width - itemSize.width;
        }
    }
};

const positionBeacon = (
    style: React.CSSProperties,
    placement: {horizontal: string; vertical: string},
    targetBounds: ClientRect | DOMRect,
    pageSize: {width: number; height: number}
) => {
    const actualBeaconRadius = BEACON_SIZE * BEACON_SIZE * 0.5;
    if (placement.horizontal === 'left') {
        if (targetBounds.left - actualBeaconRadius >= 0) {
            style.left = 0;
        } else {
            style.right = 0;
        }
    } else if (placement.horizontal === 'right') {
        if (targetBounds.width + targetBounds.left + actualBeaconRadius <= pageSize.width) {
            style.right = 0;
        } else {
            style.left = 0;
        }
    }

    if (placement.vertical === 'top') {
        if (targetBounds.top - actualBeaconRadius >= 0) {
            style.top = 0;
        } else {
            style.bottom = 0;
        }
    } else if (placement.vertical === 'bottom') {
        if (targetBounds.height + targetBounds.top + actualBeaconRadius <= pageSize.height) {
            style.bottom = 0;
        } else {
            style.top = 0;
        }
    }
};

export default ({
    offset, continous, locale, open, steps, hideCloseBtn, disabledModal, index,
    onStepChange, onClose, onNext, onBack
}: IntroProps) => {
    const o = offset || 8;
    const loc = locale || {
        back: 'Back',
        next: 'Next',
        close: 'Close'
    };
    const [stepIndex, setStepIndex] = useState(0);
    const [openTooltip, setOpenTooltip] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [targetBounds, setTargetBounds] = useState({ left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 });
    const [contentBounds, setContentBounds] = useState({ left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 });
    const pageSize = useResize(null);
    const step = steps[stepIndex];
    const isFirst = stepIndex <= 0;
    const isLast = stepIndex >= steps.length - 1;
    const onStepChangeWrapped = useCallback((v: number) => {
        setStepIndex(v);
        onStepChange && onStepChange(v);
    }, [onStepChange, stepIndex]);
    useEffect(() => {
        setStepIndex(index || 0);
    }, [index]);
    const onClickBack = () => {
        let curIndex = stepIndex - 1;
        onStepChangeWrapped(curIndex);
        onBack && onBack(curIndex);
    };
    const onClickNext = () => {
        let curIndex = stepIndex + 1;
        onStepChangeWrapped(curIndex);
        onNext && onNext(curIndex);
    };
    const onClickClose = () => {
        onClose && onClose();
    };

    const onClickBeacon = (e: React.MouseEvent) => {
        setOpenTooltip(true);
    };

    useEffect(() => {
        const target = document.querySelector(step.target);
        if (target && target instanceof HTMLElement) {
            const { top, left, width, height, right, bottom } = target.getBoundingClientRect();
            setTargetBounds({ top, left, width, height, right, bottom });
        }
    }, [step, stepIndex, pageSize.width, pageSize.height, onStepChangeWrapped]);

    useEffect(() => {
        if (contentRef.current && openTooltip) {
            const { top, left, width, height, right, bottom } = contentRef.current.getBoundingClientRect();
            setContentBounds({ top, left, width, height, right, bottom });
        }
    }, [openTooltip, pageSize.width, pageSize.height]);

    let overlayStyle: React.CSSProperties = {
        top: `${targetBounds.top}px`,
        left: `${targetBounds.left}px`,
        width: `${targetBounds.width}px`,
        height: `${targetBounds.height}px`
    };
    let rootStyle: React.CSSProperties = {
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1400,
        width: '100%'
    };
    let beaconStyle: React.CSSProperties = {};
    let contentStyle: React.CSSProperties = {};
    if (openTooltip) {
        if (disabledModal) {
            overlayStyle.pointerEvents = 'none';
        }
        overlayStyle.boxShadow = '0 0 0 2000px rgba(0, 0, 0, 0.4)';
        rootStyle.height = '100%';
    }
    positionBeacon(beaconStyle, {
        horizontal: 'left',
        vertical: 'top'
    }, targetBounds, pageSize);
    positionContent(
        contentStyle,
        step.placement || 'top-start',
        targetBounds, contentBounds,
        pageSize,
        o
    );
    return (
        <Portal>
            <Fade in={open}>
                <div style={rootStyle}>
                    <Overlay showOutline={openTooltip} style={overlayStyle}>
                        {
                            !openTooltip ? (
                                <Beacon style={beaconStyle} onClick={onClickBeacon} />
                            ) : undefined
                        }
                    </Overlay>
                    <Fade in={openTooltip} unmountOnExit>
                        <TourDialog ref={contentRef} {...step} style={contentStyle}
                            backLabel={loc.back} nextLabel={loc.next} closeLabel={loc.close}
                            showBackBtn={!isFirst} showNextBtn={continous && !isLast} showCloseBtn={!hideCloseBtn || isLast}
                            onClickBack={onClickBack} onClickNext={onClickNext} onClose={onClickClose}
                        />
                    </Fade>
                </div>
            </Fade>
        </Portal>
    );
};