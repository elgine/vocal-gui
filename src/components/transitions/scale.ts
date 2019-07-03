export default {
    '.scale-enter, .scale-exit-done': {
        opacity: 0,
        transform: 'scale(0.9, 0.9)'
    },
    '.scale-enter-active': {
        opacity: 1,
        transform: 'scale(1, 1)',
        transformOrigin: 'center center',
        transition: 'opacity 300ms, transform 300ms'
    },
    '.scale-exit': {
        opacity: 1,
        transform: 'scale(1, 1)'
    },
    '.scale-exit-active': {
        opacity: 0,
        transform: 'scale(0.9, 0.9)',
        transition: 'opacity 300ms, transform 300ms'
    }
};