import React, { useContext } from 'react';
import {
    FormControl, FormLabel, FormControlLabel, Radio, RadioGroup,
    Select, MenuItem, TextField
} from '@material-ui/core';
import { LangContext, getLang } from '../lang';
import DirectorySelector from '../components/DirectorySelector';
import { FormValidationContext } from '../components/FormValidation';

export interface ExportSettingsPanelProps{
    bitRate: number;
    format: ExportFormat;
    title: string;
    path?: string;
    onPathChange?: (v: string) => void;
    onTitleChange: (v: string) => void;
    onBitRateChange: (v: number) => void;
    onFormatChange: (v: ExportFormat) => void;
}

export default ({
    bitRate, format, title, path,
    onPathChange, onTitleChange, onBitRateChange, onFormatChange
}: ExportSettingsPanelProps) => {
    const lang = useContext(LangContext);
    return (
        <React.Fragment>
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel component="legend">
                    {
                        getLang('EXPORT_FILE_NAME', lang)
                    }
                </FormLabel>
                <TextField required fullWidth value={title} onChange={(e) => onTitleChange(e.target.value)} />
            </FormControl>
            {
                window.ELECTRON ? (
                    <FormControl fullWidth margin="normal" component="fieldset">
                        <FormLabel component="legend">
                            {
                                getLang('CHOOSE_EXPORT_DIRECTORY', lang)
                            }
                        </FormLabel>
                        <DirectorySelector value={path} onChange={onPathChange} />
                    </FormControl>
                ) : undefined
            }
            <FormControl fullWidth margin="normal" component="fieldset">
                <FormLabel component="legend">
                    {getLang('BIT_RATE', lang)}
                </FormLabel>
                <Select value={bitRate} onChange={(e) => onBitRateChange(e.target.value as number)} required fullWidth>
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
                <RadioGroup value={format} onChange={(e, v) => onFormatChange(v as ExportFormat)} row>
                    <FormControlLabel
                        control={<Radio color="primary" value="WAV" />}
                        label="WAV"
                    />
                    <FormControlLabel
                        control={<Radio color="primary" value="MP3" />}
                        label="MP3"
                    />
                </RadioGroup>
            </FormControl>
        </React.Fragment>
    );
};