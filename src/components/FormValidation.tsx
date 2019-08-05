import React, { createContext, useCallback, useState, useEffect } from 'react';

interface FormComponent<T = any>{
    value?: T;
    error?: boolean;
    onChange?: (v: T) => void;
}

type CollectFn<P extends FormComponent> = (Component: React.ComponentType<P>, opts: ValidationOptions) => React.ComponentType<P>;

interface ValidationOptions{
    key: string;
    value: any;
    onChange: (v: any) => void;
    validate: (v: any) => boolean;
}

interface ValidatedField{
    key: string;
    value: any;
    valid: boolean;
}

export interface FormValidationProps{
    collect?: CollectFn<any>;
}

export const FormValidationContext = createContext<FormValidationProps>({

});

interface ValidationProps{
    isValid?: boolean;
}

export function FormValidation<T extends ValidationProps>(Component: React.ComponentType<T>) {
    return (props: T) => {
        const [fieldMap, setFieldMap] = useState<Dictionary<ValidatedField>>({});
        const collect = useCallback(function<P extends FormComponent>(Component: React.ComponentType<P>, { key, validate }: ValidationOptions) {
            return (props: P) => {
                const { value } = props;
                const updateFieldMap = useCallback(() => {
                    let fieldMapCopy = { ...fieldMap };
                    fieldMapCopy[key] = { key, value, valid: validate(value) };
                    setFieldMap(fieldMapCopy);
                }, [fieldMap, key, value, validate]);
                useEffect(updateFieldMap, [updateFieldMap]);
                return (
                    <Component {...props} error={fieldMap[key] ? !fieldMap[key].valid : undefined} />
                );
            };
        }, [fieldMap]);
        const isValid = Object.values(fieldMap).every((t) => t.valid);
        return (
            <FormValidationContext.Provider value={{ collect }}>
                <Component {...props} isValid={isValid} />
            </FormValidationContext.Provider>
        );
    };
}