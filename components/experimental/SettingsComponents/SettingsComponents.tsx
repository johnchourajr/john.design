import clsx from 'clsx';
import { LayoutGroup, m } from 'motion/react';
import React from 'react';

import type {
  BooleanSetting,
  ButtonSetting,
  SelectSetting,
  Setting,
  SliderSetting,
} from './settings';

/**
 * Each control receives its own setting and hands back a copy with a new
 * value of the right type. The group writes it back by key.
 */
type ControlProps<T extends Setting> = {
  index: number;
  setting: T;
  onChange: (next: T) => void;
};

function SettingsBoolean<T extends BooleanSetting>({
  index,
  setting,
  onChange,
}: ControlProps<T>) {
  const toggle = () => {
    onChange({ ...setting, value: !setting.value });
  };

  return (
    <m.div
      className="grid grid-cols-[5rem_1fr] items-center gap-4"
      layout="position"
    >
      <span className="truncate">{setting.label}</span>
      <button
        type="button"
        onClick={toggle}
        className={clsx(
          'flex p-1 rounded-full bg-[rgba(255,255,255,.2)] w-12',
          setting.value ? 'justify-end' : 'justify-start',
        )}
      >
        <m.div
          id={`toggle-${index}`}
          layout
          className={clsx(
            'w-5 h-5 rounded-full',
            setting.value ? 'bg-(--root-color)' : 'bg-[#000000]',
          )}
        />
      </button>
    </m.div>
  );
}

function SettingsSlider<T extends SliderSetting>({
  setting,
  onChange,
}: ControlProps<T>) {
  // valueAsNumber, never the string `value`: shader uniforms are numeric and
  // vgpu rejects strings (#92).
  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...setting, value: e.currentTarget.valueAsNumber });
  };

  return (
    <m.div
      className="grid grid-cols-[5rem_1fr_1rem] items-center gap-4"
      layout="position"
    >
      <span className="truncate">{setting.label}</span>
      <input
        type="range"
        min={setting.min}
        max={setting.max}
        step={setting.step || 1}
        value={setting.value}
        onChange={update}
      />
      <span>
        {setting.value}
        {setting.unit}
      </span>
    </m.div>
  );
}

function SettingsSelect<T extends SelectSetting>({
  setting,
  onChange,
}: ControlProps<T>) {
  const { options } = setting;

  const choose = (value: T['value'] | undefined) => {
    if (value !== undefined) onChange({ ...setting, value });
  };

  // Only ever store one of the options, whatever the DOM reports.
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    choose(options.find((option) => option === e.target.value));
  };

  const navigateOptions = (direction: 'prev' | 'next') => {
    const currentIndex = options.indexOf(setting.value);
    const newIndex =
      direction === 'prev'
        ? (currentIndex - 1 + options.length) % options.length
        : (currentIndex + 1) % options.length;
    choose(options[newIndex]);
  };

  return (
    <m.div
      className="grid grid-cols-[5rem_1fr] items-center gap-4"
      layout="position"
    >
      <span className="truncate">{setting.label}</span>
      <div className="inline-flex items-center gap-1">
        <select
          value={setting.value}
          onChange={handleChange}
          className="border-1 border-root ring-root text-root p-1 rounded w-32"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="inline-flex gap-1">
          <button
            type="button"
            onClick={() => navigateOptions('prev')}
            className="border-1 border-root ring-root text-root px-2 rounded hover:opacity-50"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => navigateOptions('next')}
            className="border-1 border-root ring-root text-root px-2 rounded hover:opacity-50"
          >
            ↓
          </button>
        </div>
      </div>
    </m.div>
  );
}

function SettingsButton({ setting }: { setting: ButtonSetting }) {
  return (
    <m.button
      type="button"
      onClick={setting.onClick}
      className="bg-root text-white p-2 rounded"
      layout="position"
    >
      {setting.label}
    </m.button>
  );
}

/** Narrows a setting by kind while keeping its exact type. */
function isKind<S extends Setting, K extends Setting['kind']>(
  setting: S,
  kind: K,
): setting is S & Extract<Setting, { kind: K }> {
  return setting.kind === kind;
}

type SettingsGroupProps<S extends Setting> = {
  settings: readonly S[];
  setSettings: (next: S[]) => void;
};

export function SettingsGroup<S extends Setting>({
  settings,
  setSettings,
}: SettingsGroupProps<S>) {
  // Write a changed setting back by its key, not its position.
  const replace = (next: S) => {
    setSettings(
      settings.map((setting) => (setting.key === next.key ? next : setting)),
    );
  };

  return (
    <LayoutGroup>
      <m.div
        className="sticky bg-black p-4 bottom-2 left-2 flex gap-4 flex-col w-fit max-w-[380px] z-100 rounded-2xl overflow-hidden border-1 border-[#ffffff24]"
        layout
      >
        {settings.map((setting, index) => {
          // Index keys keep the rows' layout animation as it was when the
          // gen-shader swaps one shader's sliders for another's.
          if (isKind(setting, 'boolean')) {
            return (
              <SettingsBoolean
                key={index}
                index={index}
                setting={setting}
                onChange={replace}
              />
            );
          }
          if (isKind(setting, 'slider')) {
            return (
              <SettingsSlider
                key={index}
                index={index}
                setting={setting}
                onChange={replace}
              />
            );
          }
          if (isKind(setting, 'select')) {
            return (
              <SettingsSelect
                key={index}
                index={index}
                setting={setting}
                onChange={replace}
              />
            );
          }
          if (isKind(setting, 'button')) {
            return <SettingsButton key={index} setting={setting} />;
          }
          return null;
        })}
      </m.div>
    </LayoutGroup>
  );
}
