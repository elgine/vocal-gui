declare module 'rc-form'{
    import React from 'react';
    interface CreateFormOptions{
        validateMessages?: any;
        onFieldsChange?: (props: any, changed: any, all: any) => void;
        onValuesChange?: (props: any, changed: any, all: any) => void;
        mapProps?: (props: any) => any;
        mapPropsToFields?: (props: any) => any;
        fieldNameProp?: string;
        fieldMetaProp?: string;
        fieldDataProp?: string;
    }
    class Field {
        constructor(fields: any);
    }
    interface FieldOptions{
        valuePropName?: string;
        getValueProps?: (val: any) => any;
        getValueFromEvent?: (e: any) => any;
        initialValue?: any;
        normalize?: any;
        trigger?: string;
        validateTrigger?: string[];
        rules?: any[];
        validateFirst?: boolean;
        validate?: any[];
        hidden?: boolean;
        preserve?: boolean;
    }
    interface FormShape{
        getFieldsValue: (names?: string[]) => void;
        getFieldValue: (name: string) => void;
        getFieldInstance: (name: string) => void;
        setFieldsValue: (obj: any) => void;
        setFields: (obj: any) => void;
        setFieldsInitialValue: (obj: any) => void;
        getFieldDecorator: (name: string, option?: FieldOptions) => (node: React.ReactNode) => React.ReactNode;
        getFieldProps: (name: string, option?: any) => void;
        getFieldsError: (names: string[]) => Dictionary<string[]>;
        getFieldError: (name: string) => string[];
        isFieldValidating: (name: string) => boolean;
        isFieldsValidating: (names: string[]) => boolean;
        isFieldsTouched: (names: string[]) => boolean;
        isFieldTouched: (name: string) => boolean;
        validateFields: (p1?: string[]|((errors: any, values: any) => void), p2?: string[]|((errors: any, values: any) => void), p3?: (errors: any, values: any) => void) => void;
        resetFields: (names?: string[]) => void;
    }
    function createForm(options?: CreateFormOptions): <T>(WrappedComponent: React.ComponentType<T>) => React.ComponentType<Omit<T, 'form'>>;
    function createFormField(): Field;
    type formShape = FormShape;
}