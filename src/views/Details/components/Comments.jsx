import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './Comments.module.css';
import CommentCard from './CommentCard';
import { addComment } from "../../../firebase/db.js";
import { getCurrentUser } from "../../../firebase/auth.js";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const Comments = ({ animeId, comments }) => {
    const { userInfo, comments: commentList } = comments;
    const [input, setInput] = useState('');
    const [visibleCount, setVisibleCount] = useState(5);
    const bottomRef = useRef(null);
    const { t } = useLanguage();

    const handleSendACB = () => {
        if (!userInfo.isLogin) return;
        if (!input.trim()) return;
        addComment(getCurrentUser().userId, animeId, input).then(() => setInput(''))
    };

    // Load more comments
    const observerCallback = useCallback(
        (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                setVisibleCount((prev) =>
                    Math.min(prev + 5, commentList.length)
                );
            }
        },
        [commentList.length]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            threshold: 0,
            rootMargin: '0px 0px 100px 0px',
        });

        const currentRef = bottomRef.current;
        const timeoutId = setTimeout(() => {
            if (currentRef) {
                observer.observe(currentRef);
            }
        }, 100); // Delayed binding to ensure DOM is ready

        return () => {
            clearTimeout(timeoutId);
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [observerCallback, commentList.length]);


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{t('details.comment') || 'Comment'}</h2>
            <hr className={styles.divider} />

            <div className={styles.inputBox}>
                <textarea
                    disabled={!userInfo.isLogin}
                    placeholder={
                        userInfo.isLogin ? (t('details.writeComment') || 'Write a comment...') : (t('details.loginToComment') || 'Please login to comment')
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={styles.textarea}
                />
                <button
                    className={styles.sendBtn}
                    disabled={!userInfo.isLogin || !input.trim()}
                    onClick={handleSendACB}
                >
                    {t('details.send') || 'Send'}
                </button>
            </div>

            <div className={styles.commentList}>
                {commentList.slice(0, visibleCount).map((comment, index) => (
                    <CommentCard
                        key={index}
                        commentId={comment.id}
                        username={comment.username}
                        avatar={comment.avatar}
                        text={comment.text}
                        likes={comment.likes}
                        hasLiked={comment.hasLiked}
                        timestamp={comment.timestamp}
                        index={index}
                        userId={comment.userId}
                    />
                ))}

                {/* Observation target element */}
                <div ref={bottomRef} className={styles.bottomMarker} />
            </div>
        </div>
    );
};

export default Comments;
