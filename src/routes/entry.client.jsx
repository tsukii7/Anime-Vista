import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import LoadingIndicator from "../components/LoadingIndicator.jsx";

ReactDOM.hydrateRoot(
    document,
    <React.StrictMode>
        <HydratedRouter fallbackElement={<LoadingIndicator />} />
    </React.StrictMode>
)
