import { useAppSelector } from 'app/hooks';
import { getUserNickname } from 'app/mainSlice';
import { MAX_USERS_TO_DISPLAY } from 'consts';
import { useMemo } from 'react';
import useLanguage from './useLanguage';
import { lng } from './useLanguage/types';

export default function useTruncateUserList(userArray: string[], youFirst = true) {
  const language = useLanguage();
  const nickname = useAppSelector(getUserNickname);

  const userList = useMemo(() => {
    let users = userArray.slice();
    const you = youFirst && nickname && userArray.includes(nickname);
    if (you) {
      const youIndex = userArray.indexOf(nickname);
      users.splice(youIndex, 1);
    }
    users = users.slice(0, MAX_USERS_TO_DISPLAY);
    if (userArray.length > MAX_USERS_TO_DISPLAY)
      users.push(
        language(lng.onlineAndMore).replace('%', String(userArray.length - MAX_USERS_TO_DISPLAY))
      );
    if (you) users.unshift(language(lng.you));
    return users;
  }, [userArray, language, nickname, youFirst]);

  return userList;
}
