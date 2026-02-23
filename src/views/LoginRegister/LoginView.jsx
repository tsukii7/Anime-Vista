import * as React from 'react';
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
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [alertMessage, setAlertMessage] = React.useState('');
    const [openAlert, setOpenAlert] = React.useState(false);

    const showAlert = (message) => {
        setAlertMessage(message);
        setOpenAlert(true);
    };

    const handleClose = () => {
        setOpenAlert(false);
    };

    const getFriendlyLoginError = (firebaseMsg) => {
        if (!firebaseMsg) return t('auth.loginFailed');
        if (firebaseMsg.includes('auth/invalid-credential')) return t('auth.invalidCredential');
        if (firebaseMsg.includes('auth/user-disabled')) return t('auth.userDisabled');
        if (firebaseMsg.includes('auth/user-not-found')) return t('auth.userNotFound');
        if (firebaseMsg.includes('auth/wrong-password')) return t('auth.wrongPassword');
        return t('auth.loginCheckCredentials');
    };


    const handleLogin = async () => {
        if (!email || !password) {
            showAlert(t('auth.enterEmailAndPassword'));
            return;
        }

        try {
            const resultAction = await dispatch(signInWithEmail({ email, password }));

            if (signInWithEmail.rejected.match(resultAction)) {
                showAlert(getFriendlyLoginError(resultAction.payload));
            }
        } catch (error) {
            showAlert(`${t('auth.unexpectedErrorPrefix')} ${error.message}`);
            console.error(error);
        }
    };


    const handleForgetPassword = () => {
        if (!email) {
            showAlert(t('auth.enterEmail'));
        } else {
            dispatch(forgetPassword(email));
            showAlert(t('auth.passwordResetSent'));
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
