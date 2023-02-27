import { useAppSelector } from 'app/hooks';
import { getCurrentLanguage } from 'app/mainSlice';
import { CurrentLanguageType } from 'types/types';
import LANGUAGE_DATA from './languageData';
import { lng } from './types';

export function getLanguageItem(language: CurrentLanguageType, index: lng) {
  return LANGUAGE_DATA[language][index];
}

export default function useLanguage() {
  const currentLanguage = useAppSelector(getCurrentLanguage);

  return (index: lng) => {
    return LANGUAGE_DATA[currentLanguage][index];
  };
}
