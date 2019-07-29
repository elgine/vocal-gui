import React, { useContext } from 'react';
import {
    FormControl, FormLabel, FormControlLabel, Radio, RadioGroup,
    Select, MenuItem
} from '@material-ui/core';
import { LangContext, getLang } from '../lang';

export interface ExportSettingsPanelProps{
    bitRate: number;
    format: ExportFormat;
    onBitRateChange: (v: number) => void;
    onFormatChange: (v: ExportFormat) => void;
}

export default ({ bitRate, format, onBitRateChange, onFormatChange }: ExportSettingsPanelProps) => {
    const lang = useContext(LangContext);
    const br = bitRate || 128;
    const f = format || 'MP3';
    return (
        <React.Fragment>
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel component="legend">
                    {getLang('BIT_RATE', lang)}
                </FormLabel>
                <Select value={br} onChange={(e) => onBitRateChange(e.target.value as number)} required fullWidth>
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
                <RadioGroup value={f} onChange={(e, v) => onFormatChange(v as ExportFormat)} row>
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