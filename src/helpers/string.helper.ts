export function isNullOrWhitespace(input: string | null | undefined) {
  if (typeof input === 'undefined' || input === null) {
    return true;
  }
  return input.replace(/\s/g, '').length < 1;
}
