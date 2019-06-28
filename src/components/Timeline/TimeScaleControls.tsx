import React, { useRef, useState } from 'react';
import Popover from '../Popover';
import Button from '../Button';
import { MdLinearScale } from 'react-icons/md';
import Box from '../Grid/Box';
import Slider from '../Slider';

export default () => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const onBtnClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchor(e.target as HTMLElement);
        setPopoverVisible(!popoverVisible);
    };
    const onPopoverClose = () => {
        setPopoverVisible(false);
    };
    return (
        <React.Fragment>
            <Button flat onClick={onBtnClick}>
                <MdLinearScale />
            </Button>
            <Popover anchorEl={anchor} visible={popoverVisible}
                onClose={onPopoverClose}>
                <Slider />
                {/* <Box pa="md">

                </Box> */}
            </Popover>
        </React.Fragment>
    );
};