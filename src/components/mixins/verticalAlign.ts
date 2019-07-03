export default (align: 'top' | 'middle' | 'bottom' = 'middle') => ({
    '&::before': {
        content: '""',
        height: '100%',
        width: '0',
        display: 'inline-block',
        verticalAlign: align
    },
    '&>*': {
        display: 'inline-block',
        verticalAlign: align,
    }
});