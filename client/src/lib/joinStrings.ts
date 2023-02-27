export default function joinStrings(
  separator: string,
  ...strings: Array<string | null | undefined>
): string {
  return strings.filter((str) => typeof str === 'string' && str !== '').join(separator);
}
