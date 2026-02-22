import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTagTranslation } from '../utils/tagUtils';

const TranslatedTag = ({ tag, className }) => {
    const { t, lang } = useLanguage();
    const translatedText = useTagTranslation(tag, t, lang);

    return (
        <span className={className}>
            {translatedText}
        </span>
    );
};

export default TranslatedTag;
