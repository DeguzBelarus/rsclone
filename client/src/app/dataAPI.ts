import { IRequestMethods, Undefinable } from 'types/types';

export const requestMethods: IRequestMethods = {
  get: 'GET',
  post: 'POST',
  delete: 'DELETE',
  put: 'PUT',
  patch: 'PATCH',
};

export function requestData(
  url: string,
  method: string,
  body?: string | FormData,
  token?: string
): Undefinable<Promise<Response>> {
  try {
    if (token) {
      if (body && typeof body !== 'string') {
        return fetch(url, {
          method,
          body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        return fetch(url, {
          method,
          body,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } else {
      if (body && typeof body !== 'string') {
        return fetch(url, {
          method,
          body,
        });
      } else {
        return fetch(url, {
          method,
          body,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }
  } catch (exception: unknown) {
    if (exception instanceof Error) {
      console.error('\x1b[40m\x1b[31m\x1b[1m', exception.message);
    }
  }
}
