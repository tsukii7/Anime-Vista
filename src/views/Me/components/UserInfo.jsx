import styles from '../MeView.module.css';

const UserInfo = ({ avatar, name, userId }) => {
  return (
    <div className={styles.userProfileSection}>
      <img 
        src={avatar}
        className={styles.userAvatar}
        alt="User Avatar"
      />
      <div className={styles.userInfoText}>
        <span className={styles.userGreeting}>Hi, {name} (oﾟ▽ﾟ)o</span>
        <span className={styles.userDetails}>ID: {userId}</span>
      </div>
    </div>
  );
};

export default UserInfo;
