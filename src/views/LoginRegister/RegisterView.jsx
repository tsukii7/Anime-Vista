import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../models/authentication/loginSlice';
import "../../styles/LoginRegister.css";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLanguage } from '../../i18n/LanguageContext';

export function RegisterView() {
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('error'); // 'error' | 'success'
    const [openAlert, setOpenAlert] = useState(false);
    const showAlert = (message, severity = 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setOpenAlert(true);
    };

    const handleClose = () => {
        setOpenAlert(false);
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const getFriendlyError = (firebaseMsg) => {
        if (!firebaseMsg) return 'Registration failed. Please try again.';
        if (firebaseMsg.includes('auth/email-already-in-use')) return 'This email is already registered.';
        if (firebaseMsg.includes('auth/invalid-email')) return 'Invalid email address.';
        if (firebaseMsg.includes('auth/weak-password')) return 'Password is too weak. Try using a mix of letters and numbers.';
        if (firebaseMsg.includes('auth/operation-not-allowed')) return 'Email/password accounts are not enabled. Please contact support.';
        return 'Registration failed. Please check your information and try again.';
    };

    async function handleRegister() {
        if (!username || !email || !password || !confirmPassword) {
            showAlert('Please fill in all fields');
            return;
        }

        if (!emailRegex.test(email)) {
            showAlert('Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Passwords do not match');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            showAlert('Password must be at least 8 characters and include both letters and numbers');
            return;
        }

        try {
            const resultAction = await dispatch(register({ username, email, password }));

            if (register.rejected.match(resultAction)) {
                showAlert(getFriendlyError(resultAction.payload));
            } else {
                showAlert('Registration successful! Redirecting...', 'success');
            }
        } catch (error) {
            showAlert('Unexpected error: ' + error.message);
        }
    }


    return (
        <div className="form">
            <div className="input-form">
                <div className="input-hint">{t('auth.username') || 'Username'}</div>
                <input value={username} className="input-field" onChange={(e) => setUsername(e.target.value)} />
                <div className="input-hint">{t('auth.email')}</div>
                <input value={email} className="input-field" onChange={(e) => setEmail(e.target.value)} />
                <div className="input-hint">{t('auth.password')}</div>
                <input type="password" value={password} className="input-field" onChange={(e) => setPassword(e.target.value)} />
                <div className="input-hint">{t('auth.confirmPassword') || 'Confirm Password'}</div>
                <input type="password" value={confirmPassword} className="input-field" onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="button-form">
                <button onClick={handleRegister} className="email-login">{t('auth.register')}</button>
            </div>

            <Snackbar
                open={openAlert}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={alertSeverity} sx={{ width: '100%' }} onClose={handleClose}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
