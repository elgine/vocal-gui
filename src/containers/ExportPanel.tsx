import React, { useContext } from 'react';
import {
    FormGroup, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup,
    Select, MenuItem
} from '@material-ui/core';
import { LangContext, getLang } from '../lang';

export interface ExportPanelProps{
    sampleRate?: number;
    bitRate?: number;
    format?: ExportFormat;
}

export default ({ sampleRate, bitRate, format }: ExportPanelProps) => {
    const lang = useContext(LangContext);
    const sr = sampleRate || 44100;
    const br = bitRate || 128;
    const f = format || 'MP3';
    return (
        <React.Fragment>
            <FormControl fullWidth variant="outlined" margin="normal" component="fieldset">
                <FormLabel component="legend">
                    {getLang('SAMPLE_RATE', lang)}
                </FormLabel>
                <FormGroup>
                    <Select value={sr} required fullWidth>
                        <MenuItem value={44100}>44100</MenuItem>
                        <MenuItem value={48000}>48000</MenuItem>
                        <MenuItem value={22050}>22050</MenuItem>
                        <MenuItem value={11025}>11025</MenuItem>
                        <MenuItem value={8000}>8000</MenuItem>
                    </Select>
                </FormGroup>
            </FormControl>
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel component="legend">
                    {getLang('BIT_RATE', lang)}
                </FormLabel>
                <Select value={br} required fullWidth>
                    <MenuItem value={64}>64</MenuItem>
                    <MenuItem value={96}>96</MenuItem>
                    <MenuItem value={128}>128</MenuItem>
                    <MenuItem value={192}>192</MenuItem>
                    <MenuItem value={320}>320</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel component="legend">
                    {getLang('EXPORT_FORMAT', lang)}
                </FormLabel>
                <RadioGroup value={f} row>
                    <FormControlLabel
                        control={<Radio color="primary" value="WAV" />}
                        label="WAV"
                    />
                    <FormControlLabel
                        control={<Radio color="primary" value="MP3" />}
                        label="MP3"
                    />
                    <FormControlLabel
                        control={<Radio color="primary" value="M4A" />}
                        label="M4A"
                    />
                </RadioGroup>
            </FormControl>
        </React.Fragment>
    );
};