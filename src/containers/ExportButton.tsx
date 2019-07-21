import React, { useState, useContext } from 'react';
import { LangContext, getLang } from '../lang';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import Export from '../components/Export';
import ExportPanel from './ExportPanel';

export default () => {
    const lang = useContext(LangContext);
    const [showExport, setShowExport] = useState(false);
    return (
        <React.Fragment>
            <Tooltip title={getLang('EXPORT', lang)} onClick={() => setShowExport(true)}>
                <IconButton>
                    <Export />
                </IconButton>
            </Tooltip>
            <Dialog open={showExport} onClose={() => setShowExport(false)}>
                <DialogTitle>
                    {
                        getLang('EXPORT', lang)
                    }
                </DialogTitle>
                <DialogContent>
                    <ExportPanel />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowExport(false)}>{getLang('CANCEL', lang)}</Button>
                    <Button color="primary">{getLang('EXPORT', lang)}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};