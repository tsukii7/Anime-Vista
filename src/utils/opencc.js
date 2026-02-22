import * as OpenCC from 'opencc-js';

let converter = null;

/**
 * Converts Traditional Chinese text to Simplified Chinese using OpenCC.
 * This is local and synchronous, avoiding API latency and machine translation hallucinations.
 * @param {string} text 
 * @returns {string} Simplified Chinese text
 */
export function t2s(text) {
    if (!text || typeof text !== 'string') return text;

    // Lazily initialize converter
    if (!converter) {
        converter = OpenCC.Converter({ from: 't', to: 'cn' });
    }

    return converter(text);
}
