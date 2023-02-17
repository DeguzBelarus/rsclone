import { APP_TITLE } from 'consts';

export function setAppTitle() {
  document.title = APP_TITLE;
}

const meta = document.createElement('meta');
meta.name = 'theme-color';
document.head.append(meta);

export function setAppBarColor(color: string) {
  meta.content = color;
}
