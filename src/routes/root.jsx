import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from 'react-router';
import TopBar from '../components/layout/TopBar';
import SideBar from '../components/layout/SideBar';
import { Provider } from 'react-redux';
import store from '../app/store';
import '../styles/global.css';

export function Layout({ children }) {
    return (
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
    );
}

export default function Root() {
    return <Outlet />;
}
