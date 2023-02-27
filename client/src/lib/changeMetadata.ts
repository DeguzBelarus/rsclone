import { APP_TITLE } from 'consts';

export function setAppTitle() {
  document.title = APP_TITLE;
}

let meta: HTMLMetaElement;

export function setAppBarColor(color: string) {
  if (!meta) {
    meta = document.querySelector('meta[name=theme-color]') || document.createElement('meta');
    meta.name = 'theme-color';
    document.head.append(meta);
  }
  meta.content = color;
}
