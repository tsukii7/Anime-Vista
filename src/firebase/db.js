import {
    doc,
    setDoc,
    getDoc,
    addDoc,
    collection,
    updateDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    query,
    where,
    documentId,
    orderBy,
    onSnapshot, getDocs
} from "firebase/firestore"
import { db, auth } from "./config.js"
import { getCurrentUser } from "./auth.js";
import { onAuthStateChanged } from "firebase/auth";
import * as React from "react";
import { fetchAnimeDataBatch } from "../models/me/meSlice.js";

function formatDate(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${y}-${m}-${d} ${h}:${min}`;
}

async function addUser(userId, username, avatar) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        // User already exists, don't overwrite their data (favorites, introduction, etc.)
        return;
    }

    const newUser = {
        userId: userId,
        hashedUserId: hashUidToNumber(userId),
        username: username,
        avatar: avatar,
        favorites: [],
        introduction: 'This is your introduction',
    }
    await setDoc(userRef, newUser);
}

async function getUserById(userId) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }
}

function hashUidToNumber(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash *= 16777619;
    }
    return Math.abs(hash >>> 0); // Convert to positive integer
}

async function getUserByNumber(num) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('hashedUserId', '==', num));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        if (querySnapshot.size > 1) {
            console.log("More than one user found with the same number!");
            return null;
        }
        const doc = querySnapshot.docs[0];
        return doc.data();
    } else {
        console.log("No such user!");
        return null;
    }
}

async function addFavorite(userId, animeId) {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, { favorites: arrayUnion(animeId) })
}

async function removeFavorite(userId, animeId) {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, { favorites: arrayRemove(animeId) });
}

async function getFavoritesByUserId(userId) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data().favorites;
    } else {
        console.log("No such document!");
        return [];
    }
}

async function addComment(userId, animeId, text) {
    const comment = {
        animeId: animeId,
        likedUsers: [],
        text: text,
        timestamp: serverTimestamp(),
        userId: userId,
    }

    const commentRef = await addDoc(collection(db, 'comments'), comment);

    return commentRef.id;
}

function listenToComments(animeId, setComments) {
    if (!animeId) {
        setComments([]);
        return () => { };
    }
    const commentsRef = collection(db, 'comments');
    const q = query(
        commentsRef,
        where('animeId', '==', animeId),
        orderBy('timestamp', 'desc')
    );

    const fetchUsersMap = async (userIds) => {
        const ids = Array.from(new Set((userIds || []).filter(Boolean)));
        if (ids.length === 0) return new Map();

        const usersMap = new Map();
        for (let i = 0; i < ids.length; i += 10) {
            const chunk = ids.slice(i, i + 10);
            const usersQuery = query(
                collection(db, 'users'),
                where(documentId(), 'in', chunk)
            );
            const usersSnap = await getDocs(usersQuery);
            usersSnap.forEach((userDoc) => {
                usersMap.set(userDoc.id, userDoc.data());
            });
        }
        return usersMap;
    };

    const unsubscribe = onSnapshot(q, async (snapshot) => {
        const user = getCurrentUser();
        const commentEntries = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            data: docSnap.data(),
        }));
        const usersMap = await fetchUsersMap(commentEntries.map((entry) => entry.data.userId));
        const results = commentEntries.map(({ id, data }) => {
            const userData = usersMap.get(data.userId);
            return {
                id,
                username: userData?.username,
                avatar: userData?.avatar,
                text: data.text,
                likes: data.likedUsers.length,
                hasLiked: user ? data.likedUsers.includes(user.userId) : false,
                timestamp: data.timestamp ? formatDate(data.timestamp.toDate()) : 'Just now',
                userId: data.userId,
            };
        });

        setComments(results);
    });

    return unsubscribe;
}

async function likeComment(userId, commentId) {
    const commentRef = doc(db, 'comments', commentId);

    await updateDoc(commentRef, { likedUsers: arrayUnion(userId) });
}

async function unlikeComment(userId, commentId) {
    const commentRef = doc(db, 'comments', commentId);

    await updateDoc(commentRef, { likedUsers: arrayRemove(userId) });
}


function useUserFavorites() {
    const [favorites, setFavorites] = React.useState([]);

    React.useEffect(() => {
        let unsubFirestore = null;

        const unsubAuth = onAuthStateChanged(auth, (user) => {
            // Clean up previous Firestore listener
            if (unsubFirestore) {
                unsubFirestore();
                unsubFirestore = null;
            }

            if (!user) {
                setFavorites([]);
                return;
            }

            const userRef = doc(db, 'users', user.uid);
            unsubFirestore = onSnapshot(userRef, (docSnap) => {
                const data = docSnap.data();
                setFavorites(data?.favorites || []);
            });
        });

        return () => {
            unsubAuth();
            if (unsubFirestore) unsubFirestore();
        };
    }, []);

    return favorites;
}

function listenToUserInfoByNumber(userNumber, onData) {
    if (!userNumber || isNaN(userNumber)) {
        onData(null);
        return () => { };
    }
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('hashedUserId', '==', userNumber));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            console.warn("No user found for number:", userNumber);
            onData(null);
            return;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        onData({
            userId: data.userId,
            name: data.username || 'Guest User',
            avatar: data.avatar,
            introduction: data.introduction || '',
            favorites: data.favorites || [],
        });
    });

    return unsubscribe;
}

function listenToUserActivities(userId, dispatch, callback, onError) {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('userId', '==', userId));

    let loadingSnapshot = false;

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        if (loadingSnapshot) return;
        loadingSnapshot = true;

        try {
            if (querySnapshot.empty) {
                callback([]);
                return;
            }

            const userData = await getUserById(userId);

            const comments = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const animeIds = Array.from(new Set(comments.map(c => c.animeId)));
            const animeListResult = await dispatch(fetchAnimeDataBatch(animeIds));

            // Handle Redux Thunk error
            if (animeListResult.error) {
                console.error('Error in listenToUserActivities dispatch:', animeListResult.error);
                if (onError) onError(animeListResult.error.message);
                return;
            }

            const animeList = animeListResult?.payload;
            const animeMap = Object.fromEntries(animeList.map(media => [media.id, media]));

            const activities = comments
                .map(comment => {
                    const anime = animeMap[comment.animeId];
                    if (!anime) return null;

                    return {
                        id: comment.id,
                        userAvatar: userData?.avatar || '',
                        username: userData?.username || 'Anonymous',
                        date: comment.timestamp.toDate().toLocaleDateString('en-US', {
                            year: 'numeric', month: '2-digit', day: '2-digit'
                        }).replace(/\//g, '.'),
                        timestamp: comment.timestamp.toDate(),
                        commentText: comment.text,
                        anime: anime,
                        likeCount: String(comment.likedUsers?.length || 0),
                        animeId: anime.id,
                        hasLiked: comment.likedUsers?.includes(userId) || false
                    };
                })
                .filter(Boolean)
                .sort((a, b) => b.timestamp - a.timestamp);

            callback(activities);
        } catch (error) {
            console.error('Error in listenToUserActivities:', error);
            if (onError) onError(error.message);
        } finally {
            loadingSnapshot = false;
        }
    });

    return unsubscribe;
}

async function updateUserProfile(userId, { username, introduction, avatar }) {
    const userRef = doc(db, 'users', userId);
    const updateData = {
        username: username.trim(),
        introduction: introduction.trim()
    };
    if (avatar) {
        updateData.avatar = avatar;
    }
    await updateDoc(userRef, updateData);
}

/**
 * Resizes an image to 200x200 and returns a Base64 JPEG string.
 */
async function resizeAvatar(file) {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return resolve(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const SIZE = 200;
                canvas.width = SIZE;
                canvas.height = SIZE;

                const ctx = canvas.getContext('2d');

                // Calculate source dimensions for center cropping (Aspect Fill)
                let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;
                const aspectRatio = img.width / img.height;

                if (aspectRatio > 1) {
                    // Wider than tall
                    srcW = img.height;
                    srcX = (img.width - srcW) / 2;
                } else {
                    // Taller than wide
                    srcH = img.width;
                    srcY = (img.height - srcH) / 2;
                }

                ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, SIZE, SIZE);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function uploadAvatar(userId, file) {
    // We store the avatar directly in Firestore as a Base64 string to bypass GFW/CORS issues.
    return await resizeAvatar(file);
}


// export all
export {
    addUser,
    getUserById,
    getUserByNumber,
    hashUidToNumber,
    addFavorite,
    removeFavorite,
    getFavoritesByUserId,
    addComment,
    likeComment,
    unlikeComment,
    useUserFavorites,
    listenToComments,
    listenToUserInfoByNumber,
    listenToUserActivities,
    updateUserProfile,
    uploadAvatar
}