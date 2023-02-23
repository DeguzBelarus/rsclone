import { ChangeEvent } from 'react';

export default function useValidateInput(
  pattern: RegExp | ((value: string) => boolean),
  setter: React.Dispatch<React.SetStateAction<string>>,
  error: React.Dispatch<React.SetStateAction<boolean>>,
  setTouched: React.Dispatch<React.SetStateAction<boolean>>
) {
  return function (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string): boolean {
    const value = typeof event === 'string' ? event : event.target.value;
    setter(value);
    const valid = pattern instanceof RegExp ? pattern.test(value) : !pattern(value);

    error(!valid);
    setTouched(true);
    return valid;
  };
}
