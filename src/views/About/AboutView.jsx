import DeveloperCard from "./components/DeveloperCard";
import styles from './AboutView.module.css';
import LoadingIndicator from "../../components/LoadingIndicator.jsx";
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function AboutView({ developers = [] }) {
    const { t } = useLanguage();
    return (
        <div className={styles.aboutView}>
            <div className={styles.topRow}>
                <div className={styles.title}>{t('nav.aboutUs') || 'About us'}</div>
            </div>
            {developers.length === 0 ? (
                <LoadingIndicator />
            ) : (
                <div className={styles.developersIntro}>
                    {developers.map((dev, idx) => (
                        <div key={dev.email || idx} className={styles.developerCardContainer}>
                            <DeveloperCard
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