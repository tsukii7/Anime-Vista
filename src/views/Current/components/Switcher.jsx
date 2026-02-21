import styles from './Switcher.module.css';

export default function Switcher({ viewOption, setViewOption }) {
    const options = ["List", "Timeline"];

    return (
        <div className={styles.switcher}>
            {options.map((option, index) => {
                const isActive = viewOption === option;
                return (
                    <button
                        key={option}
                        className={`${styles.switcherOption} ${isActive ? styles.active : ''} ${
                            index === 0 ? styles.left : styles.right
                        }`}
                        onClick={() => setViewOption(option)}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
