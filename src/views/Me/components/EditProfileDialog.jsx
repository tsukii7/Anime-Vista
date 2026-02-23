import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  styled
} from '@mui/material';
import { updateUserProfile, uploadAvatar } from "../../../firebase/db.js";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import defaultAvatar from '../../../assets/default-avatar.png';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    padding: '16px',
  }
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#65558F',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#65558F',
  }
});

const StyledButton = styled(Button)({
  textTransform: 'none',
  borderRadius: '12px',
  padding: '8px 24px',
  '&.MuiButton-contained': {
    backgroundColor: '#65558F',
    '&:hover': {
      backgroundColor: '#534979',
    },
  }
});

const AvatarPreview = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '24px',
  '& img': {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '8px',
    border: '2px solid #65558F'
  }
});

const HiddenInput = styled('input')({
  display: 'none',
});

const EditProfileDialog = ({ open, onClose, userInfo, onProfileUpdate }) => {
  const { t } = useLanguage();
  const [usernameInput, setUsernameInput] = React.useState(userInfo?.name || '');
  const [introductionInput, setIntroductionInput] = React.useState(userInfo?.introduction || '');
  const [avatarPreview, setAvatarPreview] = React.useState(userInfo?.avatar || defaultAvatar);
  const [avatarFile, setAvatarFile] = React.useState(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setUsernameInput(userInfo?.name || '');
      setIntroductionInput(userInfo?.introduction || '');
      setAvatarPreview(userInfo?.avatar || defaultAvatar);
      setAvatarFile(null);
      setError('');
    }
  }, [open, userInfo]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError(t('me.avatarSizeLimit'));
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!usernameInput.trim()) {
      setError(t('me.usernameRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      let avatarUrl = userInfo.avatar;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(userInfo.userId, avatarFile);
      }

      // Update user profile in Firebase
      await updateUserProfile(userInfo.userId, {
        username: usernameInput,
        introduction: introductionInput,
        avatar: avatarUrl
      });

      // show success
      onProfileUpdate();

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(t('me.updateProfileFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <DialogTitle sx={{
        fontSize: '24px',
        fontWeight: 500,
        color: '#333',
        pb: 1
      }}>
        {t('me.editProfile') || 'Edit Profile'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: '8px'
            }}
          >
            {error}
          </Alert>
        )}

        <AvatarPreview>
          <img src={avatarPreview} alt="Avatar Preview" />
          <label htmlFor="avatar-upload">
            <HiddenInput
              accept="image/*"
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
              disabled={loading}
            />
            <StyledButton
              component="span"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={loading}
              sx={{ color: '#65558F', borderColor: '#65558F' }}
            >
              {t('me.changeAvatar') || 'Change Avatar'}
            </StyledButton>
          </label>
        </AvatarPreview>

        <StyledTextField
          autoFocus
          margin="dense"
          label={t('auth.username') || "Username"}
          type="text"
          fullWidth
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        <StyledTextField
          margin="dense"
          label={t('me.introductionTitle') || "Introduction"}
          multiline
          rows={4}
          fullWidth
          value={introductionInput}
          onChange={(e) => setIntroductionInput(e.target.value)}
          disabled={loading}
          placeholder={t('me.introduction') || "Tell us about yourself!"}
        />
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <StyledButton
          onClick={onClose}
          disabled={loading}
          sx={{
            color: '#65558F',
            '&:hover': {
              backgroundColor: 'rgba(101, 85, 143, 0.04)'
            }
          }}
        >
          {t('me.cancel') || 'Cancel'}
        </StyledButton>
        <StyledButton
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
        >
          {loading ? (t('me.saving') || 'Saving...') : (t('me.save') || 'Save')}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditProfileDialog; 