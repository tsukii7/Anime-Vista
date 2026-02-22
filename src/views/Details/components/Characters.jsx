import React, { useState } from 'react';
import styles from './Characters.module.css';
import CharacterCard from './CharacterCard';
import LoadingIndicator from "../../../components/LoadingIndicator.jsx";
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

const Characters = ({ characters }) => {
    const { t } = useLanguage();
    const [showAll, setShowAll] = useState(false);

    const displayedCharacters = showAll ? characters : characters.slice(0, 6);

    function handleShowClickACB() {
        setShowAll(!showAll);
    }

    function characterCB(character, index) {
        return (
            <CharacterCard
                key={index}
                nativeName={character.nativeName}
                fullName={character.fullName}
                image={character.image}
                role={character.role}
                cv={character.cv}
            />
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>{t('details.characters') || 'Characters'}</h2>
                <button className={styles.toggle} onClick={handleShowClickACB}>
                    {characters.length > 6 && (showAll ? (t('common.showLess') || 'show less') : (t('common.showMore') || 'show more'))}
                </button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.grid}>
                {displayedCharacters.length ?
                    displayedCharacters.map(characterCB) :
                    <LoadingIndicator isLoading={false} hasError={true} text={'Nothing found...'} />}
            </div>
        </div>
    );
};

export default Characters;
