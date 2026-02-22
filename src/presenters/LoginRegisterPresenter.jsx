import React, { useEffect, useState } from 'react';
import { LoginView } from '../views/LoginRegister/LoginView.jsx';
import { RegisterView } from '../views/LoginRegister/RegisterView.jsx';
import { useNavigate } from 'react-router';
import "../styles/LoginRegister.css";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useLanguage } from '../i18n/LanguageContext.jsx';


export default function LoginRegisterPresenter() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate(`/`);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className='login-wrapper'>
            <div className='loginRegister-box'>
                <div className='tableBar'>
                    <button
                        className={showLogin ? 'buttonActive' : 'buttonInactive'}
                        onClick={() => setShowLogin(true)}
                    >
                        {t('auth.login')}
                    </button>
                    <button
                        className={!showLogin ? 'buttonActive' : 'buttonInactive'}
                        onClick={() => setShowLogin(false)}
                    >
                        {t('auth.register')}
                    </button>
                </div>
                {showLogin ? <LoginView /> : <RegisterView />}
            </div>
        </div>
    );
}
