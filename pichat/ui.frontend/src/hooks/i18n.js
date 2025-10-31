let i18nDict = null; // populated by fetchI18n

/** 
	 * Attempts to look up the given text in the translation dictionary. If no 
	 * result or dictionary is found, returns the original text.
	 * @param {string} text
	 */
export function i18n(text) {
    return i18nDict?.[text] ?? text;
}