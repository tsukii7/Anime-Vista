import styles from '../MeView.module.css';

const Conditions = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabNavigation}>
      <button
        className={`${styles.tabItem} ${activeTab === 'favorites' ? styles.activeTab : styles.inactiveTab}`}
        onClick={() => onTabChange('favorites')}
      >
        Favorites
      </button>
      <button
        className={`${styles.tabItem} ${activeTab === 'activities' ? styles.activeTab : styles.inactiveTab}`}
        onClick={() => onTabChange('activities')}
      >
        Activities
      </button>
    </div>
  );
};

export default Conditions;
