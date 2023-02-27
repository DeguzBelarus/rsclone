## Содержимое .env файлов

#### Для сервера (должен находится в корневом каталоге):
DB_HOST=localhost

DB_NAME=rsclone (имя базы данных в pgAdmin)

DB_PASSWORD=123456 (ваш пароль в pgAdmin)

DB_PORT=5432

DB_USER=postgres (имя пользователя в pgAdmin)

JWT_SECRET=jwtkey (любая строка-ключ, на Ваше усмотрение)

ADMIN_FIRST=site@email.com (email для создания пользователя с правами администратора)


#### Для клиента (должен находится в директории client):
REACT_APP_CRYPT_KEY=helloworld (любая строка-ключ, на Ваше усмотрение)

[назад](./README.md)