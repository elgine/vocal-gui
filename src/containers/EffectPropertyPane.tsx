import React, { useContext } from 'react';
import { Box, Grid, Slider } from '@material-ui/core';
import { LangContext, getLang } from '../lang';
import { EffectType } from '../processor/effectType';

export interface EffectPropertyDescriptor{
    min: number;
    max: number;
    key: string;
    title: string;
}

const GainProperty = ({ key, title, onChange, ...others }: EffectPropertyDescriptor & {value: number; onChange: (v: any) => void}) => {
    const onSliderChange = (e: React.ChangeEvent<{}>, val: number | number[]) => {
        onChange({ [key]: typeof val === 'number' ? val : val[0] });
    };
    const lang = useContext(LangContext);
    return (
        <React.Fragment>
            <Grid item xs={4}>
                {
                    getLang(title, lang)
                }
            </Grid>
            <Grid item xs={8}>
                <Slider onChange={onSliderChange} {...others} />
            </Grid>
        </React.Fragment>
    );
};

const AlienProperties = () => {
    return (
        <React.Fragment>
            <Grid item xs={4}>

            </Grid>
            <Grid item xs={8}>

            </Grid>
        </React.Fragment>
    );
};

export interface EffectPropertyPaneProps{
    type?: EffectType;
    properties?: Dictionary<EffectPropertyDescriptor>;
    value?: Dictionary<string | number>;
    onChange?: (v: any) => void;
}

export default ({ type, ...others }: EffectPropertyPaneProps) => {
    let Comp: React.ComponentType<any>|null = null;
    if (type === EffectType.ALIEN) {
        Comp = AlienProperties;
    }
    return (
        Comp ? <Comp {...others} /> : null
    );
};