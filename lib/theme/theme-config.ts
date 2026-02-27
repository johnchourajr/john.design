export const ROOT_COLOR_COOKIE_NAME = 'root_color';

export const DEFAULT_ROOT_COLOR = '#ff0000';
export const DEFAULT_ROOT_BACKGROUND = '#000000';

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const RGB_COLOR_REGEX =
  /^rgba?\(\s*(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/;
const HSL_COLOR_REGEX =
  /^hsla?\(\s*(?:\d|[1-2]\d{1,2}|3[0-5]\d|360)(?:deg)?\s*,\s*(?:\d|[1-9]\d|100)%\s*,\s*(?:\d|[1-9]\d|100)%(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/;

export function isValidThemeColor(value: string | undefined | null): boolean {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  return (
    HEX_COLOR_REGEX.test(trimmed) ||
    RGB_COLOR_REGEX.test(trimmed) ||
    HSL_COLOR_REGEX.test(trimmed)
  );
}

export function resolveThemeColor(
  fallbackColor: string,
  ...values: Array<string | undefined | null>
): string {
  for (const value of values) {
    if (isValidThemeColor(value)) {
      return value!.trim();
    }
  }

  return fallbackColor;
}
