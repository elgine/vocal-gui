import React from 'react';
import { MdLaunch } from 'react-icons/md';
import { RowProps } from '../components/Grid/Row';
import ControlBar from '../components/ControlBar';
import Button from '../components/Button';
import Select, { Option } from '../components/Select';
import Box from '../components/Grid/Box';

export interface ExportPanelProps extends Omit<RowProps, 'theme'>{
    height?: number;
}

export default ({ height, style, ...others }: ExportPanelProps) => {
    const h = height || 56;
    return (
        <ControlBar leftChildren={
            <React.Fragment>
                <Box pr="md">Save format as: </Box>
                <Select value="mp3" placeholder="Choose format" size="sm">
                    <Option value="wav">
                        wav
                    </Option>
                    <Option value="mp3">
                        mp3
                    </Option>
                    <Option value="aac">
                        aac
                    </Option>
                </Select>
            </React.Fragment>
        } rightChildren={
            <React.Fragment>
                <Button color="primary">
                    <MdLaunch />
                    &nbsp;
                    <span>export</span>
                </Button>
            </React.Fragment>
        } style={{ height: `${h}px`, ...style }} {...others}
        />
    );
};