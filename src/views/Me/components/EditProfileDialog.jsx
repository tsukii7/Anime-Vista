import React, { useState, useEffect } from 'react';
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
import {updateUserProfile} from "../../../firebase/db.js";

// 自定义样式组件
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

const EditProfileDialog = ({ open, onClose, userInfo, onProfileUpdate }) => {
  const [usernameInput, setUsernameInput] = useState(userInfo?.name || '');
  const [introductionInput, setIntroductionInput] = useState(userInfo?.introduction || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setUsernameInput(userInfo?.name || '');
      setIntroductionInput(userInfo?.introduction || '');
      setError('');
    }
  }, [open, userInfo]);

  const handleSubmit = async () => {
    if (!usernameInput.trim()) {
      setError('Username cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update user profile in Firebase
      await updateUserProfile(userInfo.userId, {
        username: usernameInput,
        introduction: introductionInput
      });

      // show success
      onProfileUpdate();

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
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
        Edit Profile
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
        <StyledTextField
          autoFocus
          margin="dense"
          label="Username"
          type="text"
          fullWidth
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        <StyledTextField
          margin="dense"
          label="Introduction"
          multiline
          rows={4}
          fullWidth
          value={introductionInput}
          onChange={(e) => setIntroductionInput(e.target.value)}
          disabled={loading}
          placeholder="Tell us about yourself!"
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
          Cancel
        </StyledButton>
        <StyledButton 
          onClick={handleSubmit} 
          disabled={loading} 
          variant="contained"
        >
          {loading ? 'Saving...' : 'Save'}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditProfileDialog; 