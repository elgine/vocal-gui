import React, { useRef, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';

export default () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) {
            let canvas = canvasRef.current;
            let ctx = canvas.getContext('2d');
        }

    }, [canvasRef.current]);
    return (
        <Box>
            <canvas ref={canvasRef} />
        </Box>
    );
};