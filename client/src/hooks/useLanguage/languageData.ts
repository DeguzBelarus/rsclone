import { LangaugeData, lng } from './types';

const LANGUAGE_DATA: LangaugeData = {
  en: {
    [lng.email]: 'Email',
    [lng.emailHint]: 'Please enter a valid email address',
    [lng.password]: 'Password',
    [lng.passwordHint]: 'Please enter your password',
    [lng.register]: 'Register',
    [lng.login]: 'Log in',
    [lng.loginWelcome]: 'Enter your login and password',
    [lng.loginSuccess]: 'You have been successfully logged in',
    [lng.loginError]: 'Wrong email or password. Try again!',

    [lng.nickname]: 'Nickname',
    [lng.nicknameHint]: 'At least 3 characters long',
    [lng.repeatPassword]: 'Repeat password',
    [lng.repeatPasswordHint]: 'The passwords should match',

    [lng.registerWelcome]: 'Create a new account',
    [lng.registerSuccess]: 'You have been registered',
    [lng.registerError]: 'Regisration error. Try again later!',

    [lng.languageSelect]: 'App language',
    [lng.userMessages]: 'Messages',
    [lng.userPosts]: 'All Posts',
    [lng.userAddPost]: 'Create new post',
    [lng.userNotFound]: 'The user with the id of % was not found. ',

    [lng.settings]: 'Settings',
    [lng.logout]: 'Log out',

    [lng.addPhoto]: 'Add photo',
    [lng.deletePhoto]: 'Delete photo',

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

    [lng.confirm]: 'Confirm',
    [lng.cancel]: 'Cancel',
    [lng.save]: 'Save',
    [lng.close]: 'Close',

    [lng.searchPlaceholder]: 'Search users...',
    [lng.searchWelcome]: 'Start typing to look for users...',
    [lng.searchNotFound]: 'Users were not found for this input (%)',

    [lng.admin]: 'admin',
    [lng.online]: 'Online',
    [lng.offline]: 'Offline',

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
    [lng.postCreated]: 'Created',
    [lng.postEdited]: 'edited',

    [lng.secondsAgo]: 'seconds ago',
    [lng.minutesAgo]: 'minutes ago',
    [lng.hoursAgo]: 'hours ago',
    [lng.yesterday]: 'yesterday',
  },

  ru: {
    [lng.email]: 'Электронная почта',
    [lng.emailHint]: 'Введите валидный адрес',
    [lng.password]: 'Пароль',
    [lng.passwordHint]: 'Минимальная длина пароля - 8 символов',
    [lng.register]: 'Регистрация',
    [lng.login]: 'Войти',
    [lng.loginWelcome]: 'Введите ваши данные для входа',
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
    [lng.userMessages]: 'Сообщения',
    [lng.userPosts]: 'Все посты',
    [lng.userAddPost]: 'Добавить пост',
    [lng.userNotFound]: 'Пользователь с id % не найден на сервере. ',

    [lng.settings]: 'Настройки',
    [lng.logout]: 'Выйти',

    [lng.addPhoto]: 'Добавить фотографию',
    [lng.deletePhoto]: 'Удалить фотографию',

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

    [lng.confirm]: 'Подтвердить',
    [lng.cancel]: 'Отменить',
    [lng.close]: 'Закрыть',
    [lng.save]: 'Сохранить',

    [lng.searchPlaceholder]: 'Поиск',
    [lng.searchWelcome]: 'Начните ввод, чтобы начать поиск пользователей',
    [lng.searchNotFound]: `Пользователи по запросу '%' не были найдены`,

    [lng.admin]: 'администратор',
    [lng.online]: 'Онлайн',
    [lng.offline]: 'Оффлайн',

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
    [lng.postCreated]: 'Создан',
    [lng.postEdited]: 'отредактирован',

    [lng.secondsAgo]: 'секунд назад',
    [lng.minutesAgo]: 'минут назад',
    [lng.hoursAgo]: 'часов назад',
    [lng.yesterday]: 'вчера',
  },
};

export default LANGUAGE_DATA;
