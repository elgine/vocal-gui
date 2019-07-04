import React from 'react';
import { ListView, GridItem } from '../components/ListView';

export default () => {
    return (
        <ListView gutter="md" items={
            []
        } renderItem={
            (item) => (
                <GridItem {...item} />
            )
        }
        />
    );
};