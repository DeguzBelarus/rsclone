export default function truncateString(str: string, maxLength = 20): string {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
}
