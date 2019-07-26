import { useState, useEffect, useCallback } from 'react';

export default (key: string = 'first') => {
    const [first, setFirst] = useState(false);
    useEffect(() => {
        const val = window.localStorage.getItem(key);
        setFirst(Boolean(val));
    }, [key]);
    useCallback(() => {
        window.localStorage.setItem(key, String(first));
    }, [first]);
    return {
        first,
        setFirst
    };
};