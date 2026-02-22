import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import AboutView from '../views/About/AboutView';

export default function AboutPresenter() {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDevelopers() {
            try {
                const querySnapshot = await getDocs(collection(db, 'developers'));
                const devs = querySnapshot.docs.map(doc => doc.data());
                setDevelopers(devs);
            } catch (err) {
                console.error("Error fetching developers:", err);
                setDevelopers([]);
            } finally {
                setLoading(false);
            }
        }

        fetchDevelopers();
    }, []);

    return <AboutView developers={developers} loading={loading} />;
}