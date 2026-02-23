import * as React from 'react';
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
} from 'react-router';
import TopBar from '../components/layout/TopBar';
import SideBar from '../components/layout/SideBar';
import { Provider } from 'react-redux';
import store from '../app/store';
import { LanguageProvider } from '../i18n/LanguageContext';
import '../styles/global.css';

export function Layout({ children }) {
    return (
        <LanguageProvider>
            <Provider store={store}>
                <html lang="en">
                    <head>
                        <Meta />
                        <Links />
                    </head>
                    <body>
                        <div className="app-container">
                            <TopBar />
                            <div className="main-layout">
                                <SideBar />
                                <main className="page-content">
                                    {children}
                                    <ScrollRestoration />
                                    <Scripts />
                                </main>
                            </div>
                        </div>
                    </body>
                </html>
            </Provider>
        </LanguageProvider>
    );
}

export function ErrorBoundary({ error }) {
    let message = "An unexpected error occurred.";
    let details = "";

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "Page Not Found" : "Navigation Error";
        details = error.statusText || error.data?.message;
    } else if (error instanceof Error) {
        message = error.message;
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <h1 style={{ fontSize: '4rem', margin: '0' }}>(╯°□°)╯︵ ┻━┻</h1>
            <h2 style={{ color: '#666' }}>{message}</h2>
            {details && <p style={{ color: '#888' }}>{details}</p>}
            <button
                onClick={() => window.location.reload()}
                style={{
                    padding: '10px 20px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    backgroundColor: '#A6A1B8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    marginTop: '20px'
                }}
            >
                Reload Page
            </button>
        </div>
    );
}

export default function Root() {
    return <Outlet />;
}
