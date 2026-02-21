import React from 'react';
import '../styles/global.css';
import miku_loading from '../assets/miku-loading.gif'
import miku_running from '../assets/miku-running.gif'
import miku_crying from '../assets/miku-crying.gif'

const LoadingIndicator = ({isLoading = true, hasError = false, text = ''}) => {
    if (!isLoading && !hasError) return null;

    return (
        <div className="loadingContainer">
            <h3 className="loadingText">
                {text ? text : (hasError ? "Oops! Something went wrong..." : "Just a moment... Miku is spinning up the data!")}
            </h3>
            <img
                src={hasError ? miku_crying : Math.random() > 0.5 ? miku_loading : miku_running} className="loadingImg"
                alt={hasError ? "Error" : "Loading..."}
            />
        </div>
    );
};


export default LoadingIndicator;
