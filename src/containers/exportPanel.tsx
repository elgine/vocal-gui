import React from 'react';
import { Row } from '../components/Grid';
import { RowProps } from '../components/Grid/Row';
import ControlBar from '../components/ControlBar';
import Button from '../components/Button';
import Select, { Option } from '../components/Select';
import Box from '../components/Grid/Box';

export interface ExportPanelProps extends Omit<RowProps, 'theme'>{

}

export default ({ ...others }: ExportPanelProps) => {
    return (
        <ControlBar leftChildren={
            <React.Fragment>
                <Box pr="md">Save as </Box>
                <Select size="sm">
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
                <Button>
                    export
                </Button>
            </React.Fragment>
        } {...others}
        />
    );
};