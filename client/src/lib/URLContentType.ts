export type MediaContentType = 'img' | 'video' | 'audio';

const videoExtentions = ['mp4'];
const audioExtentions = ['ogg', 'mp3'];

export default function getURLContentType(url: string): MediaContentType {
  let contentType: MediaContentType = 'img';
  let extention = url.split('.').pop();
  if (extention) {
    extention = extention.toLocaleLowerCase();
    if (videoExtentions.includes(extention)) {
      contentType = 'video';
    } else if (audioExtentions.includes(extention)) {
      contentType = 'audio';
    }
  }
  return contentType;
}
