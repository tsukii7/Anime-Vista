import styles from './CharacterCard.module.css';

const roleColorMap = {
    Main: styles.main,
    Supporting: styles.supporting,
    Background: styles.background,
};

const CharacterCard = ({nativeName, fullName, image, role, cv}) => {
    const roleStyle = roleColorMap[role] || styles.background;

    return (
        <div className={`${styles.card} ${roleStyle}`}>
            <img src={image} alt={fullName} className={styles.avatar}/>
            <div className={styles.textBlock}>
                <div className={styles.nameBlock}>
                    <div className={styles.nativeName}>
                        {nativeName || 'N/A'}
                    </div>
                    <div className={styles.fullName}>
                        {fullName || 'N/A'}
                    </div>
                </div>

                <div className={styles.detail}>
                    <strong>
                        {role || 'N/A'}
                    </strong>
                </div>

                <div className={styles.detail}>
                    CV: {cv || 'N/A'}
                </div>
            </div>
        </div>
    );
};

export default CharacterCard;
