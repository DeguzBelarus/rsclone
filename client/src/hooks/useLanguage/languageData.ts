import { LangaugeData, lng } from './types';

const LANGUAGE_DATA: LangaugeData = {
  en: {
    [lng.email]: 'Email',
    [lng.emailHint]: 'Please enter a valid email address',
    [lng.emoji]: 'Emoji',
    [lng.password]: 'Password',
    [lng.passwordHint]: 'Please enter your password',
    [lng.register]: 'Register',
    [lng.login]: 'Log in',
    [lng.loginWelcome]: 'Log in',
    [lng.loginSuccess]: 'You have been successfully logged in',
    [lng.loginError]: 'Wrong email or password. Try again!',

    [lng.nickname]: 'Nickname',
    [lng.nicknameHint]: 'At least 3 characters long',
    [lng.repeatPassword]: 'Repeat password',
    [lng.repeatPasswordHint]: 'The passwords should match',

    [lng.registerWelcome]: 'New account',
    [lng.registerSuccess]: 'You have been registered',
    [lng.registerError]: 'Regisration error. Try again later!',

    [lng.languageSelect]: 'App language',
    [lng.darkMode]: 'Dark mode',
    [lng.lightMode]: 'Light mode',
    [lng.userMessages]: 'Messages',
    [lng.userPosts]: 'All Posts',
    [lng.userAddPost]: 'Create new post',
    [lng.userNotFound]: 'The user with the id of % was not found. ',

    [lng.settings]: 'Settings',
    [lng.logout]: 'Log out',

    [lng.uploadPhoto]: 'Upload a photo',
    [lng.changePhoto]: 'Change photo',
    [lng.deletePhoto]: 'Delete photo',
    [lng.chooseAvatar]: 'Choose your avatar photo',
    [lng.chooseDefault]: 'or select from the list',

    [lng.age]: 'Age',
    [lng.ageHint]: 'Age must be between 0 and 99 years',
    [lng.country]: 'Country',
    [lng.countryHint]: 'At least 3 characters long',
    [lng.city]: 'City',
    [lng.cityHint]: 'At least 3 characters long',
    [lng.firstName]: 'First name',
    [lng.firstNameHint]: 'At least 3 characters long',
    [lng.lastName]: 'Last name',
    [lng.lastNameHint]: 'At least 3 characters long',
    [lng.newPassword]: 'New password',

    [lng.update]: 'Update',
    [lng.notFound]: 'The page you are looking for was not found',
    [lng.goToHome]: 'Go to homepage',

    [lng.dangerZone]: 'Danger zone',
    [lng.giveUpAdmin]: 'Give up admin rights',
    [lng.giveUpAdminMsg]:
      'Are you sure you want to give up your admin rights? This cannot be undone.',
    [lng.deleteAccount]: 'Delete account',
    [lng.deleteAccountMsg]: 'Are you sure you want to delete your account? This cannot be undone.',
    [lng.deleteAccountOtherMsg]: `Are you sure you want to delete this user's account? This cannot be undone.`,
    [lng.upgradeRole]: 'Upgrade role',
    [lng.upgradeRoleMsg]: `Are you sure you want to upgrade this user's rights? This cannot be undone.`,

    [lng.confirm]: 'Confirm',
    [lng.cancel]: 'Cancel',
    [lng.save]: 'Save',
    [lng.close]: 'Close',
    [lng.collapse]: 'Collapse',
    [lng.expand]: 'Expand',
    [lng.clear]: 'Clear',
    [lng.fullScreen]: 'Fullscreen mode',
    [lng.fullScreenExit]: 'Exit fullscreen mode',

    [lng.searchPlaceholder]: 'Search users...',
    [lng.searchWelcome]: 'Start typing to look for users...',
    [lng.searchNotFound]: 'Users were not found for this input (%)',

    [lng.admin]: 'admin',
    [lng.online]: 'Online',
    [lng.offline]: 'Offline',
    [lng.onlineAndMore]: 'and % more',
    [lng.chat]: 'Сhat',

    [lng.newPostTitle]: 'New post',
    [lng.editPostTitle]: 'Edit post',
    [lng.postTitle]: 'Heading',
    [lng.postTitleHint]: 'Please add post heading',
    [lng.postBody]: 'Post body',
    [lng.postBodyHint]: 'Please add post body',
    [lng.postUploadMedia]: 'Upload media',
    [lng.postUploadMediaDelete]: 'Delete media',

    [lng.postDelete]: 'Delete post',
    [lng.postDeleteMsg]: 'Are you sure you want to delete this post? This cannot be undone.',
    [lng.postEdit]: 'Edit post',
    [lng.postCopyLink]: 'Copy post link',
    [lng.postCopyLinkSuccess]: 'The link was copied to clipboard (%)',
    [lng.postOpen]: 'Open post page',
    [lng.postNotFound]: 'The post with the id of % was not found.',
    [lng.postTitleMsg]: 'Posts',
    [lng.postGuestUser]: `The user doesn't have any posts yet. You can get in touch with them by clicking on the Chat button.`,
    [lng.postSelfUser]: `You don't have any posts yet. Click the button below to add the first one.`,
    [lng.postsAllTitle]: 'All Posts',
    [lng.postsAllNoneMsg]: `No posts have been found on the server. Create your first one by selecting the option from the header menu or from the user page.`,

    [lng.commentWrite]: 'Write your comment here...',
    [lng.commentPublish]: 'Send',
    [lng.commentEdit]: 'Edit comment',
    [lng.commentDelete]: 'Delete comment',
    [lng.commentsHeading]: 'Comments',
    [lng.commentsNoneMsg]: 'No comments were added for this post. Write the first one!',

    [lng.justNow]: 'just now',
    [lng.yesterday]: 'yesterday',
    [lng.ago]: 'ago',
    [lng.minutes1]: 'minute',
    [lng.minutes2]: 'minutes',
    [lng.minutes3]: 'minutes',
    [lng.hours1]: 'hour',
    [lng.hours2]: 'hours',
    [lng.hours3]: 'hours',

    [lng.recording]: 'Recording',
    [lng.recordingStart]: 'Start recording',
    [lng.recordingStop]: 'Stop recording',
    [lng.recordingAccessing]: 'Accessing devices...',
    [lng.recordingVideo]: 'Record video',
    [lng.recordingAudio]: 'Record audio',

    [lng.loadingMsg]: 'Loading...',

    [lng.messagesHeading]: 'Conversations',
    [lng.messagesNoneMsg]:
      'Conversations are empty. Please use user search in the header and start a new conversation.',
    [lng.messagesLastMsg]: 'Last message',
    [lng.messagesUnread]: 'Unread',
    [lng.messagesClickToChat]: 'Click to chat',
    [lng.messageIsRead]: 'Message was read',

    [lng.chats]: 'Chats',
    [lng.chatWith]: 'Chat with',
    [lng.chatWrote]: 'wrote',
    [lng.chatsInputEmpty]: 'Message',
    [lng.chatWriteMessage]: 'Write message',

    [lng.formatBold]: 'Bold',
    [lng.formatItalic]: 'Italic',
    [lng.formatUnderline]: 'Underline',
    [lng.formatTitle]: 'Heading',
    [lng.formatBulletedList]: 'Bulleted List',
    [lng.formatNumberedList]: 'Numbered List',
    [lng.formatCode]: 'Code',
    [lng.formatHighlight]: 'Highlight',
    [lng.formatAddLink]: 'Add link',
    [lng.formatModifyLink]: 'Modify link',
    [lng.formatEditLinkTitle]: 'Edit Link',
    [lng.formatEditLinkMsg]: 'Please provide hyperlink address:',
    [lng.formatLinkAddress]: 'Address',

    [lng.likeFirst]: 'Be the first to like',
    [lng.you]: 'You',
  },

  ru: {
    [lng.email]: 'Электронная почта',
    [lng.emailHint]: 'Введите валидный адрес',
    [lng.emoji]: 'Эмоджи',
    [lng.password]: 'Пароль',
    [lng.passwordHint]: 'Минимальная длина пароля - 8 символов',
    [lng.register]: 'Регистрация',
    [lng.login]: 'Войти',
    [lng.loginWelcome]: 'Вход',
    [lng.loginSuccess]: 'Вы успешно вошли!',
    [lng.loginError]: 'Неправильный адрес электронной почты или пароль!',

    [lng.nickname]: 'Ник',
    [lng.nicknameHint]: 'Минимум 3 символа',
    [lng.repeatPassword]: 'Повторите пароль',
    [lng.repeatPasswordHint]: 'Пароли должны совпадать',

    [lng.registerWelcome]: 'Новый аккаунт',
    [lng.registerSuccess]: 'Аккаунт успешно создан!',
    [lng.registerError]: 'Ошибка при регистрации. Повторите позже!',

    [lng.languageSelect]: 'Язык приложения',
    [lng.darkMode]: 'Темная тема',
    [lng.lightMode]: 'Светлая тема',

    [lng.userMessages]: 'Сообщения',
    [lng.userPosts]: 'Все посты',
    [lng.userAddPost]: 'Добавить пост',
    [lng.userNotFound]: 'Пользователь с id % не найден на сервере. ',

    [lng.settings]: 'Настройки',
    [lng.logout]: 'Выйти',

    [lng.uploadPhoto]: 'Загрузить фото',
    [lng.changePhoto]: 'Поменять фотографию',
    [lng.deletePhoto]: 'Удалить фотографию',
    [lng.chooseAvatar]: 'Выбрать фото для аватара',
    [lng.chooseDefault]: 'или выбрать из списка',

    [lng.age]: 'Возраст',
    [lng.ageHint]: 'Возраст должен быть между 0 и 99',
    [lng.country]: 'Страна',
    [lng.countryHint]: 'Минимум 3 символа',
    [lng.city]: 'Город',
    [lng.cityHint]: 'Минимум 3 символа',
    [lng.firstName]: 'Имя',
    [lng.firstNameHint]: 'Минимум 3 символа',
    [lng.lastName]: 'Фамилия',
    [lng.lastNameHint]: 'Минимум 3 символа',
    [lng.newPassword]: 'Новый пароль',

    [lng.update]: 'Обновить',
    [lng.notFound]: 'Запрашиваемая страница не найдена',
    [lng.goToHome]: 'Перейти домой',

    [lng.dangerZone]: 'Зона опасности',
    [lng.giveUpAdmin]: 'Отказаться от прав',
    [lng.giveUpAdminMsg]:
      'Вы уверены, что хотите отказаться от прав администратора? Это действие необратимо.',
    [lng.deleteAccount]: 'Удалить аккаунт',
    [lng.deleteAccountMsg]: 'Вы уверены, что хотите удалить Ваш аккаунт? Это действие необратимо.',
    [lng.deleteAccountOtherMsg]:
      'Вы уверены, что хотите удалить аккаунт этого пользователя? Это действие необратимо.',
    [lng.upgradeRole]: 'Повысить права',
    [lng.upgradeRoleMsg]: `Вы уверены, что хотите повысить права этого пользователя? Это действие необратимо.`,

    [lng.confirm]: 'Подтвердить',
    [lng.cancel]: 'Отменить',
    [lng.close]: 'Закрыть',
    [lng.collapse]: 'Свернуть',
    [lng.expand]: 'Развернуть',
    [lng.save]: 'Сохранить',
    [lng.clear]: 'Очистить',
    [lng.fullScreen]: 'Во весь экран',
    [lng.fullScreenExit]: 'Покинуть полноэкранный режим',

    [lng.searchPlaceholder]: 'Поиск',
    [lng.searchWelcome]: 'Начните ввод, чтобы начать поиск пользователей',
    [lng.searchNotFound]: `Пользователи по запросу '%' не были найдены`,

    [lng.admin]: 'администратор',
    [lng.online]: 'Онлайн',
    [lng.offline]: 'Оффлайн',
    [lng.onlineAndMore]: 'и % других',
    [lng.chat]: 'Чат',

    [lng.newPostTitle]: 'Новый пост',
    [lng.editPostTitle]: 'Редактировать пост',
    [lng.postTitle]: 'Заголовок',
    [lng.postTitleHint]: 'Добавьте заголовок поста',
    [lng.postBody]: 'Пост',
    [lng.postBodyHint]: 'Добавьте тело поста',
    [lng.postUploadMedia]: 'Загрузить медиа',
    [lng.postUploadMediaDelete]: 'Удалить медиа',

    [lng.postDelete]: 'Удалить пост',
    [lng.postDeleteMsg]: 'Вы уверены, что хотите удалить этот пост? Это действие необратимо.',

    [lng.postEdit]: 'Редактировать пост',
    [lng.postCopyLink]: 'Скопировать ссылку',
    [lng.postCopyLinkSuccess]: 'Ссылка на пост была скопирована (%)',
    [lng.postOpen]: 'Открыть пост',
    [lng.postNotFound]: 'Пост с id % не найден на сервере.',

    [lng.postTitleMsg]: 'Посты',
    [lng.postGuestUser]:
      'У этого пользователя нет постов. Воспользуйтесь функцией чата, чтобы связаться с ними.',
    [lng.postSelfUser]:
      'У Вас еще нет постов. Чтобы добавить пост, нажмите на кнопку "Добавить пост" внизу страницы.',

    [lng.postsAllTitle]: 'Все посты',
    [lng.postsAllNoneMsg]: `Посты не были найдены на сервере. Вы можете добавить новый пост, выбрав соответствующую опцию из меню выше или на странице пользователя.`,

    [lng.commentWrite]: 'Напишите Ваш комментарий...',
    [lng.commentPublish]: 'Отправить',
    [lng.commentEdit]: 'Изменить комментарий',
    [lng.commentDelete]: 'Удалить комментарий',
    [lng.commentsHeading]: 'Комментарии',
    [lng.commentsNoneMsg]: 'Комментарии для этого поста еще не существуют. Добавьте первый!',

    [lng.justNow]: 'сейчас',
    [lng.ago]: 'назад',
    [lng.minutes1]: 'минуту',
    [lng.minutes2]: 'минуты',
    [lng.minutes3]: 'минут',
    [lng.hours1]: 'час',
    [lng.hours2]: 'часa',
    [lng.hours3]: 'часов',
    [lng.yesterday]: 'вчера',

    [lng.recording]: 'Запись',
    [lng.recordingStart]: 'Начать запись',
    [lng.recordingStop]: 'Остановить запись',
    [lng.recordingAccessing]: 'Идет доступ к устройствам...',
    [lng.recordingVideo]: 'Записать видео',
    [lng.recordingAudio]: 'Записать аудио',

    [lng.loadingMsg]: 'Загрузка...',

    [lng.messagesHeading]: 'Сообщения',
    [lng.messagesNoneMsg]:
      'Сообщения не найдены. Воспользуйтесь поиском пользователей сверху и напишите первое сообщение.',
    [lng.messagesLastMsg]: 'Последнее',
    [lng.messagesUnread]: 'Непрочитанные',
    [lng.messagesClickToChat]: 'Начать чат',
    [lng.messageIsRead]: 'Прочитано',

    [lng.chats]: 'Чаты',
    [lng.chatWith]: 'Чат с',
    [lng.chatWrote]: 'написал(a)',
    [lng.chatsInputEmpty]: 'Сообщение',
    [lng.chatWriteMessage]: 'Написать сообщение',

    [lng.formatBold]: 'Жирный',
    [lng.formatItalic]: 'Курсив',
    [lng.formatUnderline]: 'Подчеркивание',
    [lng.formatTitle]: 'Заголовок',
    [lng.formatBulletedList]: 'Маркированный список',
    [lng.formatNumberedList]: 'Нумерованный список',
    [lng.formatCode]: 'Код',
    [lng.formatHighlight]: 'Выделить цветом',
    [lng.formatAddLink]: 'Добавить ссылку',
    [lng.formatModifyLink]: 'Изменить ссылку',
    [lng.formatEditLinkTitle]: 'Редактировать ссылку',
    [lng.formatEditLinkMsg]: 'Введите адрес гиперссылки:',
    [lng.formatLinkAddress]: 'Адрес',

    [lng.likeFirst]: 'Добавьте первый лайк',
    [lng.you]: 'Вы',
  },
};

export default LANGUAGE_DATA;
