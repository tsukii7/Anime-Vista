import React from 'react';
import { StartServer } from 'react-router/server';
import { Layout } from './root.jsx';

export default function EntryServer({ context }) {
    return (
        <StartServer context={context} router={{ hydration: true }}>
            <Layout />
        </StartServer>
    );
}
