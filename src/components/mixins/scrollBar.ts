export default (scrollBar: ScrollBarProperties) => {
    return {
        '::-webkit-scrollbar': {
            width: `${scrollBar.width}px`,
            height: `${scrollBar.width}px`
        },
        '::-webkit-scrollbar-track': {
            boxShadow: 'none',
            backgroundColor: scrollBar.trackBgColor
        },
        '::-webkit-scrollbar-thumb': {
            boxShadow: 'none',
            backgroundColor: scrollBar.thumbBgColor,
            borderRadius: `${scrollBar.width}px`,
            transition: '0.2s ease-in all',
            '&:hover': {
                backgroundColor: scrollBar.thumbBgColorHover
            },
            '&:active': {
                backgroundColor: scrollBar.thumbBgColorActive
            }
        },
        '::-webkit-scrollbar-corner': {
            background: 'transparent'
        }
    };
};