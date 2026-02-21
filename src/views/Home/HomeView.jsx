// src/views/Home/HomeView.jsx
import React from 'react';
import Recommendation from './components/Recommendation';
import Popularity from './components/Popularity';
import styles from './HomeView.module.css';

const HomeView = () => {
    return (
        <div className={styles.container}>
            <Recommendation />
            <Popularity />
        </div>
    );
};

export default HomeView;
