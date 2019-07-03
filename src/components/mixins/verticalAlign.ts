export default (align: 'top' | 'middle' | 'bottom' = 'middle') => ({
    wordSpacing: '-1em',
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
        wordSpacing: 0
    }
});