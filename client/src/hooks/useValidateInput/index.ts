import { ChangeEvent } from 'react';

export default function useValidateInput(
  pattern: RegExp | ((value: string) => boolean),
  setter: React.Dispatch<React.SetStateAction<string>>,
  error: React.Dispatch<React.SetStateAction<boolean>>,
  setTouched: React.Dispatch<React.SetStateAction<boolean>>
) {
  return function (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) {
    const value = typeof event === 'string' ? event : event.target.value;
    setter(value);
    if (pattern instanceof RegExp) {
      error(!pattern.test(value));
    } else error(pattern(value));
    setTouched(true);
  };
}
