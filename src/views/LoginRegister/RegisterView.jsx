import * as React from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../models/authentication/loginSlice';
import "../../styles/LoginRegister.css";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLanguage } from '../../i18n/LanguageContext';

export function RegisterView() {
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState('error'); // 'error' | 'success'
    const [openAlert, setOpenAlert] = React.useState(false);
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
        if (!firebaseMsg) return t('auth.registrationFailed');
        if (firebaseMsg.includes('auth/email-already-in-use')) return t('auth.emailAlreadyInUse');
        if (firebaseMsg.includes('auth/invalid-email')) return t('auth.invalidEmail');
        if (firebaseMsg.includes('auth/weak-password')) return t('auth.weakPassword');
        if (firebaseMsg.includes('auth/operation-not-allowed')) return t('auth.operationNotAllowed');
        return t('auth.registrationCheckInput');
    };

    async function handleRegister() {
        if (!username || !email || !password || !confirmPassword) {
            showAlert(t('auth.fillAllFields'));
            return;
        }

        if (!emailRegex.test(email)) {
            showAlert(t('auth.enterValidEmail'));
            return;
        }

        if (password !== confirmPassword) {
            showAlert(t('auth.passwordsDoNotMatch'));
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            showAlert(t('auth.passwordRule'));
            return;
        }

        try {
            const resultAction = await dispatch(register({ username, email, password }));

            if (register.rejected.match(resultAction)) {
                showAlert(getFriendlyError(resultAction.payload));
            } else {
                showAlert(t('auth.registrationSuccessRedirect'), 'success');
            }
        } catch (error) {
            showAlert(`${t('auth.unexpectedErrorPrefix')} ${error.message}`);
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
