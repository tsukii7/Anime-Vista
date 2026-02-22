import React from 'react';
import styles from './CommentCard.module.css';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { hashUidToNumber, likeComment, unlikeComment } from "../../../firebase/db.js";
import { getCurrentUser } from "../../../firebase/auth.js";
import defaultAvatar from '../../../assets/default-avatar.png'
import { useNavigate } from "react-router";

const CommentCard = ({
    commentId, username, avatar, text, likes, hasLiked, timestamp, index, userId
}) => {
    const isLeft = index % 2 === 0
    const navigate = useNavigate()

    async function handleLikeClickACB() {
        if (hasLiked) {
            await unlikeComment(getCurrentUser().userId, commentId)
        } else {
            await likeComment(getCurrentUser().userId, commentId)
        }
    }

    function redirectToPersonalPageACB() {
        navigate(`/${hashUidToNumber(userId)}`)
    }

    return (<div className={`${styles.commentRow} ${isLeft ? styles.right : styles.left}`}>
        {!isLeft && <img
            src={avatar ? avatar : defaultAvatar}
            alt={username}
            className={styles.avatar}
            onClick={redirectToPersonalPageACB} />}

        <div className={styles.commentBox}>
            <div className={styles.username} onClick={redirectToPersonalPageACB}>{username}</div>
            <div className={styles.text}>{text}</div>
            <div className={styles.actions}>
                <div className={styles.timestamp}>{timestamp}</div>
                <div className={styles.like} onClick={handleLikeClickACB}>
                    <button className={styles.likeBtn}>
                        {hasLiked ? (<ThumbUpIcon className={styles.liked} sx={{ fontSize: 16 }} />) : (
                            <ThumbUpOutlinedIcon className={styles.unliked} sx={{ fontSize: 16 }} />)}
                    </button>
                    <span className={styles.likeCount}>{likes}</span>
                </div>
            </div>

        </div>

        {isLeft && <img
            src={avatar ? avatar : defaultAvatar}
            alt={username}
            className={styles.avatar}
            onClick={redirectToPersonalPageACB} />}

    </div>);
};

export default CommentCard;
