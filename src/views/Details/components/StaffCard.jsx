import React from 'react';
import styles from './StaffCard.module.css';

const StaffCard = ({ name, role, image }) => {

    return (
        <div className={styles.card}>
            <img src={image} alt={name} className={styles.avatar} />
            <div className={styles.text}>
                <div className={styles.name}>{name}</div>
                <div className={styles.role}><strong>{role}</strong></div>
            </div>
        </div>
    );
};

export default StaffCard;
