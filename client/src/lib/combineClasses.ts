type ClassDefinition = string | undefined | null | [string, boolean | undefined];

export default function combineClasses(...classes: ClassDefinition[]): string {
  return classes
    .filter(
      (item) =>
        typeof item === 'string' ||
        (Array.isArray(item) && typeof item[0] === 'string' && item[1] === true)
    )
    .map((item) => (Array.isArray(item) ? item[0] : item))
    .join(' ');
}
