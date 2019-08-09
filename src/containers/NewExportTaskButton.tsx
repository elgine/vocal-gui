import React, { useState } from 'react';
import { getLang } from '../lang';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, FormControl, FormLabel, TextField, Select,
    MenuItem, RadioGroup, FormControlLabel, Radio, FormHelperText
} from '@material-ui/core';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { ACTION_OUTPUT } from '../store/models/output/types';
import { RematchDispatch } from '@rematch/core';
import { createForm, FormShape } from 'rc-form';
import DirectorySelector from '../components/DirectorySelector';
import { SelectProps } from '@material-ui/core/Select';
import { TextFieldProps } from '@material-ui/core/TextField';
import { RadioGroupProps } from '@material-ui/core/RadioGroup';
import { RootState } from '../store';
import { DEFAULT_BITRATE, SUPPORT_BITRATES, SUPPORT_OUTPUT_FORMATS, DEFAULT_OUTPUT_FORMAT } from '../constant';

export interface NewExportTaskButtonProps{
    Component: React.ComponentType<any>;
    ComponentProps?: any;
    onClose?: () => void;
}

interface ExportSettingsDialogProps{
    open?: boolean;
    onClose?: () => void;
    form: FormShape;
}

const FlatSelect = React.forwardRef(({ onChange, ...others }: Omit<SelectProps, 'onChange'> & {onChange?: (val: any) => void}, ref: React.Ref<{}>) => {
    return (
        <Select ref={ref} onChange={(e) => onChange && onChange(e.target.value)} {...others} />
    );
});

const FlatTextField = React.forwardRef(({ onChange, ...others }: Omit<TextFieldProps, 'onChange'> & {onChange?: (val: any) => void}, ref: React.Ref<{}>) => {
    return (
        <TextField ref={ref} onChange={(e) => onChange && onChange(e.target.value)} {...others as any} />
    );
});

const FlatRadioGroup = React.forwardRef(({ onChange, ...others }: Omit<RadioGroupProps, 'onChange'> & {onChange?: (val: string) => void}, ref: React.Ref<{}>) => {
    return (
        <RadioGroup ref={ref} onChange={(e, v) => onChange && onChange(v)} {...others} />
    );
});

const mapStateToProps = ({ present }: RootState) => {
    return {
        title: present.editor.title,
        lang: present.locale.lang
    };
};

const mapLocaleStateToProps = ({ present }: RootState) => {
    return {
        ...present.locale
    };
};

const ExportSettingsDialog = React.forwardRef(({ open, onClose, form }: ExportSettingsDialogProps, ref: React.Ref<{}>) => {
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
    const { title } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch>();
    const onOutput = dispatch.output[ACTION_OUTPUT];
    const onSubmit = () => {
        form.validateFields((errors, values) => {
            if (!errors) {
                onOutput(values);
                onClose && onClose();
            }
        });
    };

    const { getFieldDecorator, getFieldError } = form;
    const getFieldErrorWrapped = (key: string) => {
        return (getFieldError(key) || []).join(', ');
    };
    const isFieldError = (key: string) => {
        return getFieldError(key) !== undefined;
    };
    return (
        <Dialog ref={ref} fullWidth maxWidth="xs" open={open || false} onClose={onClose}>
            <DialogTitle>
                {
                    getLang('NEW_EXPORT_TASK', lang)
                }
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal" component="fieldset" error={isFieldError('title')}>
                    <FormLabel component="legend">
                        {
                            getLang('EXPORT_FILE_NAME', lang)
                        }
                    </FormLabel>
                    {
                        getFieldDecorator('title', {
                            initialValue: title,
                            rules: [
                                {
                                    required: true,
                                    message: getLang('EXPORT_TITLE_REQUIRED', lang),
                                }
                            ]
                        })(<FlatTextField required fullWidth
                            error={isFieldError('title')}
                            placeholder={getLang('EXPORT_TITLE_REQUIRED', lang)}
                            helperText={getFieldErrorWrapped('title')}
                        />)
                    }
                </FormControl>
                {
                    window.__ELECTRON__ ? (
                        <FormControl fullWidth margin="normal" component="fieldset" error={isFieldError('path')}>
                            <FormLabel component="legend">
                                {
                                    getLang('CHOOSE_EXPORT_DIRECTORY', lang)
                                }
                            </FormLabel>
                            {
                                getFieldDecorator('path', {
                                    rules: [
                                        {
                                            required: true,
                                            message: getLang('EXPORT_PATH_REQUIRED', lang),
                                        },
                                    ]
                                })(<DirectorySelector />)
                            }
                            {
                                isFieldError('path') ? (
                                    <FormHelperText>
                                        {
                                            getFieldErrorWrapped('path')
                                        }
                                    </FormHelperText>
                                ) : undefined
                            }
                        </FormControl>
                    ) : undefined
                }
                <FormControl fullWidth margin="normal" component="fieldset" error={isFieldError('bitRate')}>
                    <FormLabel component="legend">
                        {getLang('BIT_RATE', lang)}
                    </FormLabel>
                    {
                        getFieldDecorator('bitRate', {
                            initialValue: DEFAULT_BITRATE,
                            rules: [
                                {
                                    required: true,
                                    message: getLang('EXPORT_BIT_RATE_REQUIRED', lang)
                                },
                            ]
                        })(<FlatSelect required fullWidth>
                            {
                                SUPPORT_BITRATES.map((v) => (
                                    <MenuItem key={v} value={v}>{v}</MenuItem>
                                ))
                            }
                        </FlatSelect>)
                    }
                    {
                        isFieldError('bitRate') ? (
                            <FormHelperText>
                                {
                                    getFieldErrorWrapped('bitRate')
                                }
                            </FormHelperText>
                        ) : undefined
                    }
                </FormControl>
                <FormControl fullWidth margin="normal" component="fieldset" error={isFieldError('format')}>
                    <FormLabel component="legend">
                        {getLang('EXPORT_FORMAT', lang)}
                    </FormLabel>
                    {
                        getFieldDecorator('format', {
                            initialValue: DEFAULT_OUTPUT_FORMAT,
                            rules: [
                                {
                                    required: true,
                                    message: getLang('EXPORT_FORMAT_REQUIRED', lang)
                                }
                            ]
                        })(<FlatRadioGroup row>
                            {
                                SUPPORT_OUTPUT_FORMATS.map((v) => (
                                    <FormControlLabel key={v}
                                        control={<Radio color="primary" value={v} />}
                                        label={v}
                                    />
                                ))
                            }
                        </FlatRadioGroup>)
                    }
                    {
                        isFieldError('format') ? (
                            <FormHelperText color="error">
                                {
                                    getFieldErrorWrapped('format')
                                }
                            </FormHelperText>
                        ) : undefined
                    }
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {
                        getLang('CANCEL', lang)
                    }
                </Button>
                <Button color="primary" onClick={onSubmit}>
                    {
                        getLang('EXPORT', lang)
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
});

const ValidatedExportSettingsDialog = createForm()(ExportSettingsDialog);

export default React.forwardRef(({ Component, ComponentProps, onClose }: NewExportTaskButtonProps, ref: React.Ref<any>) => {
    const [showExportDialog, setShowExportDialog] = useState(false);
    const onDialogClose = () => {
        setShowExportDialog(false);
        onClose && onClose();
    };
    return (
        <React.Fragment>
            <Component onClick={() => setShowExportDialog(true)} {...ComponentProps} />
            <ValidatedExportSettingsDialog open={showExportDialog} onClose={onDialogClose} />
        </React.Fragment>
    );
});