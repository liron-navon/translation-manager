// en-AU => en
export const getLanguageCode = (locale): string => {
    return locale.split('-')[0];
};
