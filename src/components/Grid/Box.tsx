import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';

const boxPaddingStyle = (spacing: ResponsiveProperty<number>, size: ComponentSize) => {
    return {
        [`&.padding-top-${size}`]: {
            paddingTop: `${spacing[size]}px`
        },
        [`&.padding-bottom-${size}`]: {
            paddingBottom: `${spacing[size]}px`
        },
        [`&.padding-left-${size}`]: {
            paddingLeft: `${spacing[size]}px`
        },
        [`&.padding-right-${size}`]: {
            paddingRight: `${spacing[size]}px`
        },
        [`&.padding-horizontal-${size}`]: {
            paddingLeft: `${spacing[size]}px`,
            paddingRight: `${spacing[size]}px`
        },
        [`&.padding-vertical-${size}`]: {
            paddingTop: `0 ${spacing[size]}px`,
            paddingBottom: `0 ${spacing[size]}px`
        },
        [`&.padding-all-${size}`]: {
            padding: `${spacing[size]}px`
        }
    };
};

const boxMarginStyle = (spacing: ResponsiveProperty<number>, size: ComponentSize) => {
    return {
        [`&.margin-top-${size}`]: {
            marginTop: `${spacing[size]}px`
        },
        [`&.margin-bottom-${size}`]: {
            marginBottom: `${spacing[size]}px`
        },
        [`&.margin-left-${size}`]: {
            marginLeft: `${spacing[size]}px`
        },
        [`&.margin-right-${size}`]: {
            marginRight: `${spacing[size]}px`
        },
        [`&.margin-horizontal-${size}`]: {
            marginLeft: `${spacing[size]}px`,
            marginRight: `${spacing[size]}px`
        },
        [`&.margin-vertical-${size}`]: {
            marginTop: `${spacing[size]}px`,
            marginBottom: `${spacing[size]}px`
        },
        [`&.margin-all-${size}`]: {
            margin: `${spacing[size]}px`
        }
    };
};

const boxStyles = (theme: Theme) => {
    const spacing = theme.spacing;
    return {
        ...boxPaddingStyle(spacing, 'sm'),
        ...boxPaddingStyle(spacing, 'md'),
        ...boxPaddingStyle(spacing, 'lg'),
        ...boxMarginStyle(spacing, 'sm'),
        ...boxMarginStyle(spacing, 'md'),
        ...boxMarginStyle(spacing, 'lg')
    };
};

export interface BoxProps extends React.HTMLAttributes<{}>{
    pt?: ComponentSize;
    pb?: ComponentSize;
    pl?: ComponentSize;
    pr?: ComponentSize;
    ph?: ComponentSize;
    pv?: ComponentSize;
    pa?: ComponentSize;
    mt?: ComponentSize;
    mb?: ComponentSize;
    ml?: ComponentSize;
    mr?: ComponentSize;
    mh?: ComponentSize;
    mv?: ComponentSize;
    ma?: ComponentSize;
}

export default ({ pt, pb, pl, pr, ph, pv, pa, mt, mb, ml, mr, mh, mv, ma, children, className, ...others }: React.PropsWithChildren<BoxProps>) => {
    return (
        <div css={boxStyles} className={
            combineClassNames(
                pt ? `padding-top-${pt}` : '',
                pb ? `padding-bottom-${pb}` : '',
                pl ? `padding-left-${pl}` : '',
                pr ? `padding-right-${pr}` : '',
                ph ? `padding-horizontal-${ph}` : '',
                pv ? `padding-vertical-${pv}` : '',
                pa ? `padding-all-${pa}` : '',
                mt ? `margin-top-${mt}` : '',
                mb ? `margin-bottom-${mb}` : '',
                ml ? `margin-left-${ml}` : '',
                mr ? `margin-right-${mr}` : '',
                mh ? `margin-horizontal-${mh}` : '',
                mv ? `margin-vertical-${mv}` : '',
                ma ? `margin-all-${ma}` : '',
                className
            )
        } {...others}>
            {children}
        </div>
    );
};