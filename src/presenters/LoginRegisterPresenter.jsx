import React, { useEffect, useState } from 'react';
import { LoginView } from '../views/LoginRegister/LoginView.jsx';
import { RegisterView } from '../views/LoginRegister/RegisterView.jsx';
import { useNavigate } from 'react-router';
import "../styles/LoginRegister.css";
import { hashUidToNumber } from "../firebase/db.js";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';


export default function LoginRegisterPresenter() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(true);

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
                        Login
                    </button>
                    <button
                        className={!showLogin ? 'buttonActive' : 'buttonInactive'}
                        onClick={() => setShowLogin(false)}
                    >
                        Register
                    </button>
                </div>
                {showLogin ? <LoginView /> : <RegisterView />}
            </div>
        </div>
    );
}
