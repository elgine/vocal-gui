import React from 'react';
import { Typography } from '@material-ui/core';

export interface SourceInfoProps extends React.HTMLAttributes<{}> {
    sampleRate: number;
    channels: number;
}

export default ({
    title, sampleRate, channels, ...others
}: SourceInfoProps) => {
    return (
        <div {...others}>
            <Typography color="primary" variant="caption">
                {sampleRate}
            </Typography>
            &nbsp;
            <Typography variant="caption">
                Hz,
            </Typography>
            &nbsp;
            <Typography color="primary" variant="caption">
                {channels}
            </Typography>
            &nbsp;
            <Typography variant="caption">
                Channels
            </Typography>
        </div>
    );
};