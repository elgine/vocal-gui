import React, { useContext } from 'react';
import { Grid, Slider } from '@material-ui/core';
import { LangContext, getLang } from '../lang';
import { EffectType } from '../processor/effectType';

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

export default ({ value, onChange, descriptor }: EffectPropertyPaneProps) => {
    const lang = useContext(LangContext);
    const descriptorArr = Object.values(descriptor);
    return (
        <React.Fragment>
            {
                descriptorArr.map(({ key, title, ...others }) => (
                    <Grid container spacing={1} key={key}>
                        <Grid item xs={6}>
                            {
                                getLang(title, lang)
                            }
                        </Grid>
                        <Grid item xs={6}>
                            <Slider {...others} value={value[key]}
                                onChange={(e, v) => onChange({
                                    [key]: typeof v === 'number' ? v : v[0]
                                })}
                            />
                        </Grid>
                    </Grid>
                ))
            }
        </React.Fragment>
    );
};