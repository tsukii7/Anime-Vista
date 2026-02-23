import { useEffect, useState } from 'react';
import styles from './MeView.module.css';
import MeFavouriteView from './MeFavoritesView';
import MeActivityView from './MeActivityView';
import EditProfileDialog from './components/EditProfileDialog';
import defaultAvatar from '../../assets/default-avatar.png'
import background from '../../assets/background.png';
import { hashUidToNumber } from "../../firebase/db.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import EditIcon from '@mui/icons-material/Edit';
import { getCurrentUser } from "../../firebase/auth.js";
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const MeView = ({ userInfo, activeTab = 'favorites', onTabChange }) => {
  const { t } = useLanguage();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (tab) => {
    onTabChange(tab);
  };


  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleProfileUpdate = () => {
    setShowSuccess(true);
  };

  return (
    <div className={styles.mainContainer}>

      {/* Background Image */}
      <img
        className={styles.backgroundImage}
        src={background}
        alt="background"
      />

      {/* Edit Button */}
      {mounted && userInfo.userId === getCurrentUser()?.userId &&
        <button
          type="button"
          className={styles.editButtonContainer}
          onClick={handleEditClick}
          aria-label={t('me.editProfile') || 'Edit profile'}
        >
          <div className={styles.editIconContainer}>
            <EditIcon fontSize="small" />
          </div>
          <span className={styles.editText}>{t('me.edit') || 'Edit'}</span>
        </button>
      }



      {/* User Information Display */}
      <div className={styles.userProfileSection}>
        <img
          className={styles.userAvatar}
          src={userInfo.avatar ? userInfo.avatar : defaultAvatar}
          alt="user profile"
        />
        <div className={styles.userInfoText}>
          <span className={styles.userGreeting}>
            {t('me.greeting') || 'Hi'}, {userInfo.name}  (oﾟ▽ﾟ)o <br />
          </span>
          <span className={styles.userDetails}>
            ID: {hashUidToNumber(userInfo.userId)} <br /><br />
            {userInfo.introduction || (t('me.introductionFallback') || "Introduce about yourself!")}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <div className={styles.tabList}>
          <button
            className={`${styles.tabItem} ${activeTab === 'favorites' ? styles.activeTab : styles.inactiveTab}`}
            onClick={() => handleTabChange('favorites')}
          >
            <div className={styles.tabLabel}>{t('me.favorites') || 'Favorites'}</div>
            {activeTab === 'favorites' && <div className={styles.tabUnderline}></div>}
          </button>

          <button
            className={`${styles.tabItem} ${activeTab === 'activities' ? styles.activeTab : styles.inactiveTab}`}
            onClick={() => handleTabChange('activities')}
          >
            <div className={styles.tabLabel}>{t('me.activities') || 'Activities'}</div>
            {activeTab === 'activities' && <div className={styles.tabUnderline}></div>}
          </button>
        </div>
        <div className={styles.dividerLine} />
      </div>

      {activeTab === 'favorites'
        ? <MeFavouriteView favorites={userInfo.favorites} />
        : <MeActivityView userId={userInfo.userId} />
      }

      <EditProfileDialog
        open={isEditDialogOpen}
        onClose={handleEditClose}
        userInfo={userInfo}
        onProfileUpdate={handleProfileUpdate}
      />
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{ width: '100%' }}
        >
          {t('me.profileUpdated') || 'Profile updated successfully!'}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MeView;
