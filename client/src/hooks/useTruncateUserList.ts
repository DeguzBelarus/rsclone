import { SHOW_MAX_USERS_ONLINE } from 'consts';
import React, { useMemo } from 'react';
import useLanguage from './useLanguage';
import { lng } from './useLanguage/types';

export default function useTruncateUserList(userArray: string[]) {
  const language = useLanguage();

  const userList = useMemo(() => {
    const users = userArray.slice(0, SHOW_MAX_USERS_ONLINE);
    if (userArray.length > SHOW_MAX_USERS_ONLINE)
      users.push(
        language(lng.onlineAndMore).replace('%', String(userArray.length - SHOW_MAX_USERS_ONLINE))
      );
    return users;
  }, [userArray, language]);

  return userList;
}
