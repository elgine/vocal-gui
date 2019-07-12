import React, { useRef, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { Dialog, Button, Box } from '@material-ui/core';
import theme from './theme';
import RecordPanel from './RecordPanel';
import { getLang, LangContext, Lang } from '../lang';

const mapStateToProps = (state: any) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {

    };
};

export interface AppProps{
}

export default connect(mapStateToProps, mapDispatchToProps)((props: AppProps) => {
    const [openRecordPanel, setOpenRecordPanel] = useState(false);
    const lang = useContext(LangContext);
    return (
        <ThemeProvider theme={theme}>
            <LangContext.Provider value={Lang.CN}>
                <Box bgcolor={theme.palette.type === 'dark' ? '#121212' : '#fff'} minHeight="100%"
                    color={theme.palette.getContrastText(theme.palette.background.default)}>
                    <Button onClick={() => setOpenRecordPanel(true)}>
                        {
                            getLang('RECORD', lang)
                        }
                    </Button>
                    <Dialog onClose={() => setOpenRecordPanel(false)}
                        open={openRecordPanel}>
                        <RecordPanel saving />
                    </Dialog>
                </Box>
            </LangContext.Provider>
        </ThemeProvider>
    );
});