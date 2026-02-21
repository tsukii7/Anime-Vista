import styles from "../../CurrentView.module.css";
import { useNavigate } from "react-router";

export default function BriefCard({ image, title, episode, time, id }) {
    const navigate = useNavigate();
    function handleClick() {
        navigate(`/details/${id}`);
    }
    return(
        <div className={styles["brief-card"]}>
            <img src={image} alt={title} className={styles["anime-image"]} onClick={handleClick}/>
            <div className= {styles["anime-info"]}>
                <h3 className= {styles["anime-title"]} onClick={handleClick}>{title}</h3>
                <p className= {styles["anime-episode"]}>Ep {episode} aired at {time}</p>
            </div>
        </div>
    )
}