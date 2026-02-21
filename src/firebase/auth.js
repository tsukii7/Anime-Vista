import {onAuthStateChanged} from 'firebase/auth';
import {action} from "mobx";
import {auth} from "./config.js";

// Initialize Firebase Authentication
export function observeAuthState(model) {
    onAuthStateChanged(auth, action(function (user) {
        setUser(user);
        setReady(false);

        if (user) {
            setReady(true);
        }
    }));

    const setUser = action(function (user) {
        model.user = user;
    });

    const setReady = action(function (ready) {
        model.ready = ready;
    });
}

export function getCurrentUser() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return null;
    }

    return {
        userId: currentUser.uid,
        avatar: currentUser.photoURL
    }
}

export function isLoggedIn() {
    return auth.currentUser !== null;
}