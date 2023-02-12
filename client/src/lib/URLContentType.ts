export type MediaContentType = 'any' | 'img' | 'video' | 'audio';

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
const videoExtensions = ['mp4', 'm4v', 'ogv', 'webm', 'flv', 'wmv', 'avi', 'mov'];
const audioExtensions = ['mp3', 'ogg', 'wav', 'm4a', 'wma'];

export default function getURLContentType(url: string): MediaContentType {
  let contentType: MediaContentType = 'any';
  let extension = url.split('.').pop();
  if (extension) {
    extension = extension.toLocaleLowerCase();
    if (imageExtensions.includes(extension)) {
      contentType = 'img';
    } else if (videoExtensions.includes(extension)) {
      contentType = 'video';
    } else if (audioExtensions.includes(extension)) {
      contentType = 'audio';
    }
  }
  return contentType;
}
