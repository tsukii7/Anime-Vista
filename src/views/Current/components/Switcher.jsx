import styles from './Switcher.module.css';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

export default function Switcher({ viewOption, setViewOption }) {
    const { t } = useLanguage();
    const options = ["List", "Timeline"];
    const labels = {
        "List": t('nav.currentList') || "List",
        "Timeline": t('nav.currentTimeline') || "Timeline"
    };

    return (
        <div className={styles.switcher}>
            {options.map((option, index) => {
                const isActive = viewOption === option;
                return (
                    <button
                        key={option}
                        className={`${styles.switcherOption} ${isActive ? styles.active : ''} ${index === 0 ? styles.left : styles.right
                            }`}
                        onClick={() => setViewOption(option)}
                    >
                        {labels[option]}
                    </button>
                );
            })}
        </div>
    );
}
