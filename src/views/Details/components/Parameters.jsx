import styles from './Parameters.module.css';

const Parameters = ({parameters}) => {

    function parameterCB(param, index) {
        return (
            <div key={index} className={styles.item}>
                <div className={styles.label}>{param.label}</div>
                <div className={styles.value}>{param.value}</div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {parameters.map(parameterCB)}
        </div>
    );
};

export default Parameters;
