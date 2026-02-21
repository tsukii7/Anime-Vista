import React, { useState } from 'react';
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

const MeView = ({ userInfo, activeTab = 'favorites', onTabChange }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

      {/* 背景图片 */}
      <img
        className={styles.backgroundImage}
        src={background}
        alt="background"
      />

      {/* 编辑按钮 */}
      {userInfo.userId === getCurrentUser()?.userId &&
        <div className={styles.editButtonContainer} onClick={handleEditClick}>
          <div className={styles.editIconContainer}>
            <EditIcon fontSize="small" />
          </div>
          <div style={{ width: 36, textAlign: 'center' }}>
            <span className={styles.editText}>Edit</span>
          </div>
        </div>
      }


      {/* 用户信息展示 */}
      <div className={styles.userProfileSection}>
        <img
          className={styles.userAvatar}
          src={userInfo.avatar ? userInfo.avatar : defaultAvatar}
          alt="user profile"
        />
        <div className={styles.userInfoText}>
          <span className={styles.userGreeting}>
            Hi, {userInfo.name}  (oﾟ▽ﾟ)o <br />
          </span>
          <span className={styles.userDetails}>
            ID: {hashUidToNumber(userInfo.userId)} <br /><br />
            {userInfo.introduction || "Introduce about yourself!"}
          </span>
        </div>
      </div>

      {/* 标签切换 */}
      <div className={styles.tabNavigation}>
        <div className={styles.tabList}>
          <button
            className={`${styles.tabItem} ${activeTab === 'favorites' ? styles.activeTab : styles.inactiveTab}`}
            onClick={() => handleTabChange('favorites')}
          >
            Favorites
          </button>

          <button
            className={`${styles.tabItem} ${activeTab === 'activities' ? styles.activeTab : styles.inactiveTab}`}
            onClick={() => handleTabChange('activities')}
          >
            Activities
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
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MeView;
