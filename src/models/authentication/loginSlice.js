import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { auth } from '../../firebase/config.js';
import {
        signInWithPopup,
        signInWithEmailAndPassword,
        sendPasswordResetEmail,
        signOut,
        GoogleAuthProvider,
        createUserWithEmailAndPassword,
        updateProfile
    } from 'firebase/auth';
import {addUser} from "../../firebase/db.js";

const provider = new GoogleAuthProvider();



export const register = createAsyncThunk(
    'auth/register',
    async ({ username, email, password }, thunkAPI) => {
        try {
            const unNamedUser = await createUserWithEmailAndPassword(auth, email, password);
            const user = unNamedUser.user;
            await updateProfile(user, { displayName: username, photoURL: null });
            await addUser(user.uid, user.displayName, user.photoURL)
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const signInWithGoogle = createAsyncThunk(
    'auth/signInWithGoogle',
    async (_, thunkAPI) => {
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            await updateProfile(user, { displayName: user.displayName, photoURL: user.photoURL });
            await addUser(user.uid, user.displayName, user.photoURL)
            return {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const signInWithEmail = createAsyncThunk(
    'auth/signInWithEmail',
    async ({ email, password }, thunkAPI) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return {uid: userCredential.user.uid, displayName: userCredential.user.displayName};
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const forgetPassword = createAsyncThunk(
    'auth/forgetPassword',
    async (email, thunkAPI) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const signOutUser = createAsyncThunk(
    'auth/signOutUser',
    async (_, thunkAPI) => {
        try {
            await signOut(auth);
            console.log('User signed out');
            return false;
        } catch (error) {
            console.error('Error signing out:', error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
const loginSlice = createSlice({
    name: 'auth',
    initialState: {
        error: null,
        isLoading: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(signOutUser.fulfilled, (state) => {
            state.error = null;
        })
        .addCase(register.fulfilled, (state) => {
            state.error = null;
        })
        .addCase(forgetPassword.fulfilled, (state) => {
            state.error = null;
        })
        .addMatcher(
            (action) => action.type.endsWith('/pending'),
            (state) => {
                state.isLoading = true;
            }
        )
        .addMatcher(
            (action) =>
                action.type.endsWith('/fulfilled') ||
                action.type.endsWith('/rejected'),
            (state) => {
                state.isLoading = false;
            }
        )
        .addMatcher(
            isAnyOf(
                signInWithGoogle.fulfilled,
                signInWithEmail.fulfilled,
            ),
            (state, action) => {
                state.currentUid = action.payload.uid || null;
                state.currentUserName = action.payload.displayName || null;
                state.currentUserPhoto = action.payload.photoURL || null;
                state.isLogged = true;
                state.error = null;
            }
        )
        .addMatcher(
            isAnyOf(
                signInWithGoogle.rejected,
                signInWithEmail.rejected,
                register.rejected,
                signOutUser.rejected,
                forgetPassword.rejected
            ),
            (state, action) => {
                state.error = action.payload;
            }
        )
    }
});

export default loginSlice.reducer;