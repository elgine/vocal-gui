import React, { useContext, useState, useEffect } from 'react';
import { Grid, Slider, Input } from '@material-ui/core';
import { LangContext, getLang } from '../lang';
import { ENTER_KEY_CODE, SLIDER_STEP_COUNT } from '../constant';

export interface EffectPropertyDescriptor{
    min: number;
    max: number;
    key: string;
    title: string;
}

export interface EffectPropertyPaneProps{
    descriptor: EffectPropertyDescriptor;
    value: Dictionary<number>;
    onChange: (v: any) => void;
}

interface PropertyFieldProps{
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
}

const inputStyle: React.CSSProperties = {
    fontSize: '0.85rem'
};

const PropertyField = ({ label, min, max, value, onChange }: PropertyFieldProps) => {
    const [inputVal, setInputVal] = useState('');
    const step = (max - min) / SLIDER_STEP_COUNT;
    const val = value || 0;
    useEffect(() => {
        setInputVal(val.toFixed(2));
    }, [val]);
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/[^0-9\.]*/g, '');
        setInputVal(v);
    };
    const onSubmit = () => {
        if (/^\d+(\.{0,1}\d+){0,3}$/.test(inputVal)) {
            onChange(Number(inputVal));
        }
    };
    const onInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === ENTER_KEY_CODE) {
            onSubmit();
        }
    };
    const onInputBlur = (e: React.FocusEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmit();
    };
    return (
        <Grid container alignItems="center" spacing={2}>
            <Grid item xs={4}>
                {
                    label
                }
            </Grid>
            <Grid item xs={5}>
                <Slider step={step} min={min} max={max}
                    value={val} onChange={(e, v) => onChange(typeof v === 'number' ? v : v[0])}
                />
            </Grid>
            <Grid item xs={3}>
                <Input
                    fullWidth
                    value={inputVal}
                    margin="dense"
                    onChange={onInputChange}
                    onBlur={onInputBlur}
                    onKeyDown={onInputKeyDown}
                    inputProps={{
                        step,
                        min: min,
                        max: max,
                        type: 'number'
                    }}
                    style={inputStyle}
                />
            </Grid>
        </Grid>
    );
};

export default ({ value, onChange, descriptor }: EffectPropertyPaneProps) => {
    const lang = useContext(LangContext);
    const descriptorArr = Object.values(descriptor);
    const onPropertyChange = (key: string) => {
        return (v: number) => {
            onChange({
                [key]: v
            });
        };
    };
    return (
        <React.Fragment>
            {
                descriptorArr.map(({ key, title, ...others }, i) => {
                    const onPChange = onPropertyChange(key);
                    return (
                        <PropertyField key={i} label={getLang(title, lang)} value={value[key]} onChange={onPChange} {...others} />
                    );
                })
            }
        </React.Fragment>
    );
};