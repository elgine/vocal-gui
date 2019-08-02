import React from 'react';
import Editor from './Editor';
import Messager from './Messager';

export default () => {
    return (
        <React.Fragment>
            <Messager />
            <Editor />
        </React.Fragment>
    );
};