import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithGoogle, signInWithEmail, forgetPassword } from '../../models/authentication/loginSlice';
import { FcGoogle } from 'react-icons/fc';
import { useLanguage } from '../../i18n/LanguageContext';
import "../../styles/LoginRegister.css";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export function LoginView() {
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [openAlert, setOpenAlert] = useState(false);

    const showAlert = (message) => {
        setAlertMessage(message);
        setOpenAlert(true);
    };

    const handleClose = () => {
        setOpenAlert(false);
    };

    const getFriendlyLoginError = (firebaseMsg) => {
        if (!firebaseMsg) return 'Login failed. Please try again.';
        if (firebaseMsg.includes('auth/invalid-credential')) return 'Incorrect email or password.';
        if (firebaseMsg.includes('auth/user-disabled')) return 'This account has been disabled.';
        if (firebaseMsg.includes('auth/user-not-found')) return 'No account found with this email.';
        if (firebaseMsg.includes('auth/wrong-password')) return 'Incorrect password.';
        return 'Login failed. Please check your credentials.';
    };


    const handleLogin = async () => {
        if (!email || !password) {
            showAlert('Please enter both email and password');
            return;
        }

        try {
            const resultAction = await dispatch(signInWithEmail({ email, password }));

            if (signInWithEmail.rejected.match(resultAction)) {
                showAlert(getFriendlyLoginError(resultAction.payload));
            }
        } catch (error) {
            showAlert('Unexpected error: ' + error.message);
            console.error(error);
        }
    };


    const handleForgetPassword = () => {
        if (!email) {
            showAlert('Please enter your email');
        } else {
            dispatch(forgetPassword(email));
            showAlert('Password reset email has been sent');
        }
    };

    return (
        <div className="form">
            <div className="input-form">
                <div className="input-hint">{t('auth.email')}</div>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                />
                <div className="input-hint">{t('auth.password')}</div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="button-form">
                <button onClick={handleLogin} className="email-login">{t('auth.login')}</button>

                <button onClick={() => dispatch(signInWithGoogle())} className="google-login">
                    <FcGoogle size={20} />
                    {t('auth.loginWithGoogle')}
                </button>
            </div>

            <button onClick={handleForgetPassword} className="forgot-password">
                {t('auth.forgotPassword')}
            </button>

            <Snackbar
                open={openAlert}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
