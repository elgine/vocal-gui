import React, { useRef, useState, useLayoutEffect } from 'react';
import { clamp } from 'lodash';
/** @jsx jsx */
import { jsx, ClassNames } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import { Row } from '../Grid';
import combineClassNames from '../../utils/combineClassNames';
import { format, compose } from '../../utils/time';
import prefix from '../../utils/prefix';
import placeholder from '../mixins/placeholder';

export interface TimeInputProps extends BaseComponentProps{
    theme: Theme;
    value?: number;
    onChange?: (v: number) => void;
}

const timeInputStyles = (theme: Theme): any => {
    return {
        input: {
            color: theme.palette.typography.body,
            textAlign: 'center',
            outline: 'none',
            border: 0,
            background: 'transparent',
            padding: `2px 0`,
            borderBottom: `2px dashed ${theme.palette.default.color}`,
            ...placeholder(theme.palette.typography.placeholder),
            '&:focus': {
                borderBottomColor: theme.palette.primary.color
            }
        }
    };
};

const isInvalidate = (str: string) => /[a-z]|[A-Z]/.test(str);

export default withTheme(({ theme, value, onChange, className, ...others }: TimeInputProps) => {
    const timeArr = format(value || 0);
    const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isInvalidate(e.target.value)) return;
        let v = Number(e.target.value);
        if (v === timeArr[0]) return;
        let timeArrCopy = timeArr.slice();
        timeArrCopy[0] = clamp(v, 0, 999);
        onChange && onChange(compose.apply(null, timeArrCopy));
    };
    const onMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isInvalidate(e.target.value)) return;
        let v = Number(e.target.value);
        if (v === timeArr[1]) return;
        let timeArrCopy = timeArr.slice();
        timeArrCopy[1] = clamp(v, 0, 59);
        onChange && onChange(compose.apply(null, timeArrCopy));
    };
    const onSecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isInvalidate(e.target.value)) return;
        let v = Number(e.target.value);
        if (v === timeArr[2]) return;
        let timeArrCopy = timeArr.slice();
        timeArrCopy[2] = clamp(v, 0, 59);
        onChange && onChange(compose.apply(null, timeArrCopy));
    };
    const onMSecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isInvalidate(e.target.value)) return;
        let v = Number(e.target.value);
        if (v === timeArr[3]) return;
        let timeArrCopy = timeArr.slice();
        timeArrCopy[3] = clamp(v, 0, 999);
        onChange && onChange(compose.apply(null, timeArrCopy));
    };

    const spanRef = useRef<HTMLElement>(null);
    const [singleWordWidth, setSingleWordWidth] = useState(14);
    useLayoutEffect(() => {
        if (spanRef.current) { setSingleWordWidth(spanRef.current.clientWidth) }
    });
    let threeWordsStyle: React.CSSProperties = {
        width: `${singleWordWidth * 4}px`
    };
    let twoWordsStyle: React.CSSProperties = {
        width: `${singleWordWidth * 3}px`
    };
    return (
        <ClassNames>
            {
                ({ css, cx }) => (
                    <Row className={
                        combineClassNames(
                            css(timeInputStyles(theme)),
                            className
                        )
                    } {...others}>
                        <input value={prefix(3, timeArr[0])} style={threeWordsStyle} onChange={onHourChange} />
                        :
                        <input value={prefix(2, timeArr[1])} style={twoWordsStyle} onChange={onMinChange} />
                        :
                        <input value={prefix(2, timeArr[2])} style={twoWordsStyle} onChange={onSecChange} />
                        .
                        <input value={prefix(3, timeArr[3])} style={threeWordsStyle} onChange={onMSecChange} />
                        <span style={{ opacity: 0, visibility: 'hidden' }} ref={spanRef}>0</span>
                    </Row>
                )
            }
        </ClassNames>
    );
});