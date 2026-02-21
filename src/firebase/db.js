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
    orderBy,
    onSnapshot, getDocs
} from "firebase/firestore"
import { db } from "./config.js"
import { getCurrentUser } from "./auth.js";
import { useEffect, useState } from "react";
import { fetchAnimeDataBatch, setActivitiesTotalPages } from "../models/me/meSlice.js";

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
    const newUser = {
        userId: userId,
        hashedUserId: hashUidToNumber(userId),
        username: username,
        avatar: avatar,
        favorites: [],
        introduction: 'This is your introduction',
    }
    await setDoc(doc(db, 'users', userId), newUser);
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
    return Math.abs(hash >>> 0); // 转成正整数
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
    const commentsRef = collection(db, 'comments');
    const q = query(
        commentsRef,
        where('animeId', '==', animeId),
        orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
        const user = getCurrentUser();
        const results = [];

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            const userRef = doc(db, 'users', data.userId);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();

            results.push({
                id: docSnap.id,
                username: userData?.username,
                avatar: userData?.avatar,
                text: data.text,
                likes: data.likedUsers.length,
                hasLiked: user ? data.likedUsers.includes(user.userId) : false,
                timestamp: formatDate(data.timestamp.toDate()),
                userId: data.userId,
            });
        }

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
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) return;

        const userRef = doc(db, 'users', user.userId);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            const data = docSnap.data();
            setFavorites(data?.favorites || []);
        });

        return () => unsubscribe();
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

function listenToUserActivities(userId, currentPage, itemsPerPage, dispatch, callback) {
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
                        animeImage: anime.coverImage.large,
                        animeTitle: anime.title.romaji,
                        animeScore: (anime.averageScore / 10).toFixed(1),
                        likeCount: String(comment.likedUsers?.length || 0),
                        animeId: anime.id,
                        hasLiked: comment.likedUsers?.includes(userId) || false
                    };
                })
                .filter(Boolean)
                .sort((a, b) => b.timestamp - a.timestamp);

            const totalItems = activities.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            dispatch(setActivitiesTotalPages(totalPages));

            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            callback(activities.slice(start, end));
        } finally {
            loadingSnapshot = false;
        }
    });

    return unsubscribe;
}

async function updateUserProfile(userId, { username, introduction }) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        username: username.trim(),
        introduction: introduction.trim()
    });
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
    updateUserProfile
}