import * as React from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import AboutView from '../views/About/AboutView';

export default function AboutPresenter() {
    const [developers, setDevelopers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchDevelopers() {
            try {
                const querySnapshot = await getDocs(collection(db, 'developers'));
                const devs = querySnapshot.docs
                    .map(doc => doc.data())
                    .filter(dev =>
                        dev.developerName !== 'Ruotong Yang' &&
                        dev.developerName !== 'Zhenghao Liu'
                    );
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