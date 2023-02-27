## Описание маршрутов (routes) сервера:

### Routes `User`:

#### 1

маршрут: `/api/user/authcheck`

тип `GET`

###### требования к запросу:

`заголовки`:
"Authorization": "Bearer `token`"

`успешное выполнение`: получение нового токена на 24 часа

#### 2

маршрут: `/api/user/:userId`

тип `GET`

###### требования к запросу:

`заголовки`:
"Authorization": "Bearer `token`"

`query params`:
lang: "ru" | "en"

`успешное выполнение`: получение данных пользователя с массивом постов и диалогов (при запросе собственных данных)

#### 3

маршрут: `/api/user/`

тип `GET`

###### требования к запросу:

`query params`:
lang: "ru" | "en"
searchKey: string

`успешное выполнение`: получение массива найденных пользователей по searchKey

#### 4

маршрут: `/api/user/registration`

тип `POST`

###### требования к запросу:

`заголовки`:
"Content-Type": "application/json"

`тело запроса`:
email: string;
nickname: string;
password: string;
lang: "en" | "ru";

`успешное выполнение`: регистрация пользователя в БЮ и получение токена на 24 часа

#### 5

маршрут: `/api/user/login`

тип `POST`

###### требования к запросу:

`заголовки`:
"Content-Type": "application/json"

`тело запроса`:
email: string;
password: string;
lang: "en" | "ru";

`успешное выполнение`: вход в систему и получение токена на 24 часа

#### 6

маршрут: `/api/user/:id/update`

тип `PUT`

###### требования к запросу:

`заголовки`:
"Content-Type": "application/json"; - только при отсутствии файла в запросе
"Authorization": "Bearer `token`"

`тело запроса`:
FormData:
email: string;
password: string;
lang: "en" | "ru";
...
avatar: string | File;
role: string;

`успешное выполнение`: изменение данных пользователя, его роли или аватара

#### 7

маршрут: `/api/user/:id/delete`

тип `DELETE`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Authorization": "Bearer `token`"

`успешное выполнение`: удаление собственного аккаунта или другого пользователя (только для админов)

### Routes `Post`:

#### 8

маршрут: `/api/post/:id`

тип `GET`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`успешное выполнение`: получение данных поста с массивами комментариев и лайков

#### 9

маршрут: `/api/post/`

тип `GET`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`успешное выполнение`: получение данных о всех постах с массивами комментариев и лайков

#### 10

маршрут: `/api/post/:id/creation`

тип `POST`

###### требования к запросу:

`заголовки`:
"Content-Type": "application/json"; - только при отсутствии файла в запросе
"Authorization": "Bearer `token`"

`тело запроса`:
FormData:
postHeading: string;
postText: string;
media?: File;
lang: "en" | "ru";

`успешное выполнение`: создание нового поста

#### 11

маршрут: `/api/post/:id/update`

тип `PUT`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Content-Type": "application/json"; - только при отсутствии файла в запросе
"Authorization": "Bearer `token`"

`тело запроса`:
FormData:
postHeading: string;
postText: string;

`успешное выполнение`: изменение поста

#### 12

маршрут: `/api/post/:id/delete`

тип `DELETE`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Authorization": "Bearer `token`"

`успешное выполнение`: удаление поста

### Routes `Comment`:

#### 13

маршрут: `/api/comment/:postId/:userId/creation`

тип `POST`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Content-Type": "application/json";
"Authorization": "Bearer `token`"

`тело запроса`:
commentText: string;

`успешное выполнение`: добавление комментария к посту

#### 14

маршрут: `/api/comment/:id/delete`

тип `DELETE`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Authorization": "Bearer `token`"

`успешное выполнение`: удаление комментария к посту

#### 15

маршрут: `/api/comment/:id/update`

тип `PUT`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Content-Type": "application/json";
"Authorization": "Bearer `token`"

`тело запроса`:
commentText: string;

`успешное выполнение`: изменение текста комментария

### Routes `Message`:

#### 16

маршрут: `/api/message/send`

тип `POST`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Content-Type": "application/json";
"Authorization": "Bearer `token`"

`тело запроса`:
messageText: string;
authorId: number;
authorNickname: string;
recipientId: number;
recipientNickname: number;

`успешное выполнение`: отправка сообщения указанному пользователю

#### 17

маршрут: `/api/message/:userId/:interlocutorId`

тип `GET`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Authorization": "Bearer `token`"

`успешное выполнение`: получение сообщений с указанным пользователем

#### 18

маршрут: `/api/message/:id/delete`

тип `DELETE`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Authorization": "Bearer `token`"

`успешное выполнение`: удаление указанного сообщения

### Routes `Like`

#### 19

маршрут: `/api/like/:postId/:userId/creation`

тип `POST`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Authorization": "Bearer `token`"

`успешное выполнение`: добавление лайка к указанному посту

#### 20

маршрут: `/api/like/:id/delete`

тип `DELETE`

###### требования к запросу:

`query params`:
lang: "ru" | "en"

`заголовки`:
"Authorization": "Bearer `token`"

`успешное выполнение`: удаление собственного лайка к указанному посту

[назад](./README.md)
