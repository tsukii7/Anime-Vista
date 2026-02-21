import styles from '../AboutView.module.css';

export default function DeveloperCard({developerName, email, linkedin, github, avatar, biography, moreInfo}) {
    return (<div className={styles.card}>

            <div className={styles.topbar}>
                <img src={avatar} alt={developerName} className={styles.avatar}/>
                <div className={styles.basicInfo}>
                    <div className={styles.developerName}>{developerName}</div>
                    <div className={styles.email}>{email}</div>
                    <div className={styles.linksRow}>
                        {linkedin && (
                            <a href={linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                My Linkedin
                            </a>)}
                        {github && (
                            <a href={github} target="_blank" rel="noopener noreferrer" className={styles.link}
                                       style={{marginLeft: '12px'}}>
                                GitHub
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.biography}>{biography}</div>
                <div className={styles.moreInfo}>{moreInfo}</div>
            </div>

        </div>)
}