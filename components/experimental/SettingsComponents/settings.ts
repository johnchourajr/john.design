/**
 * Typed definitions for the experiment settings panel (#92).
 *
 * Every setting has a stable `key` (what code looks values up by) and a
 * display `label` (what the panel shows), so renaming a label can't reset a
 * value. Each kind fixes its value type: a slider can only hold a number, a
 * toggle a boolean, a select one of its options.
 */

type SettingBase<K extends string> = {
  /** Stable identifier. Look values up by this, never by the label. */
  key: K;
  /** Text shown in the panel. Free to change. */
  label: string;
};

export type SliderSetting<K extends string = string> = SettingBase<K> & {
  kind: 'slider';
  value: number;
  min: number;
  max: number;
  /** Defaults to 1. */
  step?: number;
  /** Shown after the value. */
  unit?: string;
  /** The shader uniform this slider drives, if any. */
  uniform?: string;
};

export type BooleanSetting<K extends string = string> = SettingBase<K> & {
  kind: 'boolean';
  value: boolean;
};

export type SelectSetting<
  K extends string = string,
  O extends string = string,
> = SettingBase<K> & {
  kind: 'select';
  value: O;
  options: readonly O[];
};

/** A one-off action, such as a download. It holds no value. */
export type ButtonSetting<K extends string = string> = SettingBase<K> & {
  kind: 'button';
  onClick?: () => void;
};

export type Setting =
  | SliderSetting
  | BooleanSetting
  | SelectSetting
  | ButtonSetting;

type ExactKey<S extends Setting, K extends string> = S extends unknown
  ? string extends S['key']
    ? never
    : K extends S['key']
      ? S
      : never
  : never;

type AnyKey<S extends Setting> = S extends unknown
  ? string extends S['key']
    ? S
    : never
  : never;

/**
 * The members of `S` that `key` names. A member declared with that literal
 * key wins over members whose key is any string (such as a shader's
 * uniform sliders), so `'shader'` resolves to the shader select alone.
 */
export type SettingFor<S extends Setting, K extends string> = [
  ExactKey<S, K>,
] extends [never]
  ? AnyKey<S>
  : ExactKey<S, K>;

/** The value type a setting holds (`never` for a button). */
export type SettingValue<S> = S extends { value: infer V } ? V : never;

export const sliderSetting = <const K extends string>(
  setting: Omit<SliderSetting<K>, 'kind'>,
): SliderSetting<K> => ({ kind: 'slider', ...setting });

export const booleanSetting = <const K extends string>(
  setting: Omit<BooleanSetting<K>, 'kind'>,
): BooleanSetting<K> => ({ kind: 'boolean', ...setting });

export const selectSetting = <const K extends string, O extends string>(
  setting: Omit<SelectSetting<K, O>, 'kind'>,
): SelectSetting<K, O> => ({ kind: 'select', ...setting });

export const buttonSetting = <const K extends string>(
  setting: Omit<ButtonSetting<K>, 'kind'>,
): ButtonSetting<K> => ({ kind: 'button', ...setting });

/** The value of the setting named by `key`, or `fallback` if there is none. */
export function getSettingValue<S extends Setting, K extends S['key']>(
  settings: readonly S[] | undefined,
  key: K,
  fallback: SettingValue<SettingFor<S, K>>,
): SettingValue<SettingFor<S, K>> {
  const setting = settings?.find((s) => s.key === key);
  if (!setting || !('value' in setting)) return fallback;
  // `key` picked this setting, so its value has the type SettingFor names.
  return setting.value as SettingValue<SettingFor<S, K>>;
}

/** Each slider that names a uniform, as three.js uniforms. */
export function settingsToUniforms(settings: readonly Setting[]) {
  const uniforms: Record<string, { value: number }> = {};
  for (const setting of settings) {
    if (setting.kind === 'slider' && setting.uniform) {
      uniforms[setting.uniform] = { value: setting.value };
    }
  }
  return uniforms;
}
