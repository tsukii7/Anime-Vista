import React, { useState } from 'react';
import styles from './Staffs.module.css';
import StaffCard from './StaffCard';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";

const Staffs = ({ staffs }) => {
    const [showAll, setShowAll] = useState(false);

    const visibleStaffs = showAll ? staffs : staffs.slice(0, 6);

    function handleShowClick() {
        setShowAll(!showAll);
    }

    function staffCardCB(staff, index) {
        return (
            <StaffCard
                key={index}
                name={staff.name}
                role={staff.role}
                image={staff.image}
            />
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Staff</h2>
                <button className={styles.toggle} onClick={handleShowClick}>
                    {staffs.length > 6 && (showAll ? 'show less' : 'show more')}
                </button>
            </div>

            <hr className={styles.divider}/>

            <div className={styles.grid}>
                {visibleStaffs.length ?
                    visibleStaffs.map(staffCardCB) :
                    <LoadingIndicator isLoading={false} hasError={true} text={'Nothing found...'}/>
                }
            </div>
        </div>
    );
};

export default Staffs;
