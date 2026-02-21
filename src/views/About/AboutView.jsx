import DeveloperCard from "./components/DeveloperCard";
import styles from './AboutView.module.css';
import LoadingIndicator from "../../components/LoadingIndicator.jsx";

export default function AboutView({developers = []}) {
    return (
        <div className={styles.aboutView}>
            <div className={styles.topRow}>
                <div className={styles.title}>About us</div>
            </div>
            {developers.length === 0 ? (
                <LoadingIndicator />
            ) : (
                <div className={styles.developersIntro}>
                    {developers.map((dev, idx) => (
                        <div className={styles.developerCardContainer}>
                            <DeveloperCard
                                key={dev.email || idx}
                                developerName={dev.developerName}
                                email={dev.email}
                                linkedin={dev.linkedin}
                                github={dev.github}
                                avatar={dev.avatar}
                                biography={dev.biography}
                                moreInfo={dev.moreInfo}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}