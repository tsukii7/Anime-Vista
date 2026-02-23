// src/views/Home/components/Popularity.jsx
import PopularityTitle from './PopularityTitle';
import PopularityList from './PopularityList';
import styles from '../HomeView.module.css';

const Popularity = () => {
    return (
        <div className={styles.popularitySection}>
            <PopularityTitle />
            <PopularityList />
        </div>
    );
};

export default Popularity;
