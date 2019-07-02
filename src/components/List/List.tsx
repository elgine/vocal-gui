import React from 'react';

export interface ListProps extends Omit<React.HTMLAttributes<{}>, 'onChange'>{
    value?: Dictionary<string>;
    multiple?: boolean;
    onChange?: (v: Dictionary<string>) => void;
}

export default React.forwardRef(({ value, multiple, onChange, children, ...others }: React.PropsWithChildren<ListProps>, ref: React.Ref<any>) => {
    const val = value || {};
    const onItemClick = (v: string) => {
        if (multiple) {
            if (val[v] !== undefined) {
                let copy = { ...val };
                Reflect.deleteProperty(val, v);
                onChange && onChange(copy);
            } else {
                onChange && onChange({
                    ...val,
                    [v]: v
                });
            }
        } else {
            onChange && onChange({
                [v]: v
            });
        }
    };
    return (
        <ul ref={ref} {...others}>
            {
                React.Children.map(children, (child: any) => {
                    if (typeof child === 'object' && child.props.value && val[child.props.value] !== undefined) {
                        return React.cloneElement(child, { selected: true, onClick: () => onItemClick(child.props.value) });
                    }
                    return child;
                })
            }
        </ul>
    );
});