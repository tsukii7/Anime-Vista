// src/views/Home/components/Recommendation.jsx
import React from 'react';
import styles from '../HomeView.module.css';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import wallpaper from '../../../assets/wallpaper.jpeg'
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const Recommendation = () => {
    const { lang } = useLanguage();
    const introTextEn = [
        "Here is AnimeVista — your ultimate anime hub",
        "Catch the latest hits and seasonal gems in list or timeline view",
        "Dive into show details, rate, and review your favorites",
        "Post comments that sync with your personal feed — share the vibe",
        "Smart recommendations help you discover new anime you'll love",
        "Join the adventure — your anime world, your way"
    ];
    const introTextZh = [
        "欢迎来到 AnimeVista — 你的终极动漫中心",
        "在列表或时间线视图中捕捉最新的热门和当季动漫",
        "深入了解动漫详情，评分并评论你最喜欢的作品",
        "发表评论，与你的个人动态同步 — 分享你看番的感受",
        "智能推荐帮助你发现你会喜欢的新动漫",
        "加入冒险 — 你的动漫世界，由你做主"
    ];
    const introText = lang === 'zh' ? introTextZh : introTextEn;

    return (
        <div className={styles.recommendationWrapper}>
            <div className={styles.recommendationBanner}>
                <img
                    className={styles.recommendationImage}
                    src={wallpaper}
                    alt="Recommendation"
                />
                <div className={styles.recommendationOverlay}>
                    <div className={styles.recommendationText}>
                        <h2 className={styles.title}>{lang === 'zh' ? '欢迎来到 AnimeVista' : 'Welcome to AnimeVista'}</h2>
                        <div>
                            {introText.map((text, index) => (
                                <p key={index} className={styles.introText}>
                                    {text}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommendation;
