import React from 'react';
import { ServerRouter } from 'react-router';

export default function EntryServer({ context, url }) {
    return (
        <ServerRouter context={context} url={url} />
    );
}
