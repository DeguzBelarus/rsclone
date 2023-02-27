import cryptoJS from 'crypto-js';

const KEY = process.env.REACT_APP_CRYPT_KEY;

export function decodeMessage(message: string): string {
  try {
    if (KEY) {
      return cryptoJS.AES.decrypt(message, KEY).toString(cryptoJS.enc.Utf8);
    }
    return message;
  } catch {
    return message;
  }
}

export function encodeMessage(message: string): string {
  try {
    if (KEY) {
      const encodedMessage = cryptoJS.AES.encrypt(message, KEY).toString();
      return encodedMessage || message;
    }
  } catch {
    return message;
  }
  return message;
}
