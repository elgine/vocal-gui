import React, { useState } from 'react';
import { getLang } from '../lang';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, FormControl, FormLabel, TextField, Select,
    MenuItem, RadioGroup, FormControlLabel, Radio, FormHelperText
} from '@material-ui/core';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { ACTION_RENDER } from '../store/models/render/types';
import { RematchDispatch } from '@rematch/core';
import { createForm, FormShape } from 'rc-form';
import DirectorySelector from '../components/DirectorySelector';
import { SelectProps } from '@material-ui/core/Select';
import { TextFieldProps } from '@material-ui/core/TextField';
import { RadioGroupProps } from '@material-ui/core/RadioGroup';
import { RootState } from '../store';

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
    const onRender = dispatch.render[ACTION_RENDER];
    const onSubmit = () => {
        form.validateFields((errors, values) => {
            if (!errors) {
                onRender(values);
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
                                isFieldError ? (
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
                            initialValue: 64,
                            rules: [
                                {
                                    required: true,
                                    message: getLang('EXPORT_BIT_RATE_REQUIRED', lang)
                                },
                            ]
                        })(<FlatSelect required fullWidth>
                            <MenuItem value={64}>64</MenuItem>
                            <MenuItem value={96}>96</MenuItem>
                            <MenuItem value={128}>128</MenuItem>
                            <MenuItem value={192}>192</MenuItem>
                            <MenuItem value={320}>320</MenuItem>
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
                            initialValue: 'MP3',
                            rules: [
                                {
                                    required: true,
                                    message: getLang('EXPORT_FORMAT_REQUIRED', lang)
                                }
                            ]
                        })(<FlatRadioGroup row>
                            <FormControlLabel
                                control={<Radio color="primary" value="WAV" />}
                                label="WAV"
                            />
                            <FormControlLabel
                                control={<Radio color="primary" value="MP3" />}
                                label="MP3"
                            />
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