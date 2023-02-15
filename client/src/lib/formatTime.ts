import { getLanguageItem } from 'hooks/useLanguage';
import { lng } from 'hooks/useLanguage/types';
import { CurrentLanguageType } from 'types/types';

export default function formatTime(
  time: number,
  type: 'min' | 'hour',
  lang: CurrentLanguageType
): string {
  const formKeys = {
    min: [lng.minutes1, lng.minutes2, lng.minutes3],
    hour: [lng.hours1, lng.hours2, lng.hours3],
  };

  let result = `${String(time)} `;
  const forms = formKeys[type];

  if (lang === 'ru') {
    switch (time % 10) {
      case 1:
        result += getLanguageItem(lang, forms[0]);
        break;
      case 2:
      case 3:
      case 4:
        result += getLanguageItem(lang, forms[1]);
        break;
      default:
        result += getLanguageItem(lang, forms[2]);
    }
  } else {
    result += getLanguageItem(lang, time === 1 ? forms[0] : forms[1]);
  }

  return `${result} ${getLanguageItem(lang, lng.ago)}`;
}
