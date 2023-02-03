import { useAppSelector } from 'app/hooks';
import { getCurrentLanguage } from 'app/mainSlice';
import LANGUAGE_DATA from './languageData';
import { lng } from './types';

export default function useLanguage() {
  const currentLanguage = useAppSelector(getCurrentLanguage);

  return (index: lng) => {
    return LANGUAGE_DATA[currentLanguage][index];
  };
}
