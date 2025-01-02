import clsx from 'clsx';
import { LayoutGroup, m } from 'framer-motion';
import React from 'react';

export function getSettingValue(
  settings: any,
  name: string,
  fallback: string | boolean | number = true,
) {
  if (!settings || settings === undefined) return fallback;
  return settings?.find((setting: any) => setting.name === name).value;
}

// hook that can write state to an object on an array
// https://stackoverflow.com/a/58485871/104380

export function useArrayState(array: any, setArray: any, index: number) {
  const [state, setState] = React.useState(array[index]);

  React.useEffect(() => {
    setState(array[index]);
  }, [array, index]);

  const setArrayState = (newState: any) => {
    const newArray = [...array];
    newArray[index] = newState;
    setArray(newArray);
    setState(newState);
  };

  return [state, setArrayState];
}
function SettingsBoolean({ index, name, settings, setSettings, value }: any) {
  const [state, setArrayState] = useArrayState(settings, setSettings, index);

  // set state.value to true or false
  const toggle = () => {
    setArrayState({ ...state, value: !state.value });
  };

  return (
    <div className="grid grid-cols-[5rem_1fr] items-center gap-4">
      <span className="truncate">{name}</span>
      <button
        onClick={toggle}
        className={clsx(
          'flex p-1 rounded-full bg-[rgba(255,255,255,.2)] w-12',
          state.value ? 'justify-end' : 'justify-start',
        )}
      >
        <m.div
          id={`toggle-${index}`}
          layout
          className={clsx(
            'w-5 h-5 rounded-full',
            state.value ? 'bg-[var(--root-color)]' : 'bg-[#000000]',
          )}
        />
      </button>
    </div>
  );
}
function SettingsSlider({ index, name, settings, setSettings, min, max }: any) {
  const [state, setArrayState] = useArrayState(settings, setSettings, index);
  // create slider input
  const slider = React.useRef<HTMLInputElement>(null);

  // set state.value to slider value
  const update = () => {
    setArrayState({ ...state, value: slider?.current?.value });
  };

  return (
    <div className="grid grid-cols-[5rem_1fr_1rem] items-center gap-4">
      <span className="truncate">{name}</span>
      <input
        ref={slider}
        type="range"
        min={min}
        max={max}
        step={state.step || 1}
        value={state.value}
        onChange={update}
      />
      <span>
        {state.value}
        {state.unit}
      </span>
    </div>
  );
}

function SettingsSelect({ index, name, settings, setSettings, options }: any) {
  const [state, setArrayState] = useArrayState(settings, setSettings, index);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArrayState({ ...state, value: e.target.value });
  };

  const navigateOptions = (direction: 'prev' | 'next') => {
    const currentIndex = options.indexOf(state.value);
    const newIndex =
      direction === 'prev'
        ? (currentIndex - 1 + options.length) % options.length
        : (currentIndex + 1) % options.length;
    setArrayState({ ...state, value: options[newIndex] });
  };

  return (
    <div className="grid grid-cols-[5rem_1fr] items-center gap-4">
      <span className="truncate">{name}</span>
      <div className="inline-flex items-center gap-1">
        <select
          value={state.value}
          onChange={handleChange}
          className="border-1 border-root ring-root text-root p-1 rounded w-32"
        >
          {options.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="inline-flex gap-1">
          <button
            onClick={() => navigateOptions('prev')}
            className="border-1 border-root ring-root text-root px-2 rounded hover:opacity-50"
          >
            ↑
          </button>
          <button
            onClick={() => navigateOptions('next')}
            className="border-1 border-root ring-root text-root px-2 rounded hover:opacity-50"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsGroup({ settings, setSettings }: any) {
  return (
    <LayoutGroup>
      <div className="sticky bg-black p-4 bottom-0 left-0 flex gap-4 flex-col w-fit max-w-[380px] z-[100] rounded-tr-2xl">
        {settings.map(({ type, ...rest }: any, index: number) => {
          switch (type) {
            case 'Boolean':
              return (
                <SettingsBoolean
                  key={index}
                  index={index}
                  {...{ settings, setSettings }}
                  {...rest}
                />
              );
            case 'Slider':
              return (
                <SettingsSlider
                  key={index}
                  index={index}
                  {...{ settings, setSettings }}
                  {...rest}
                />
              );
            case 'Select':
              return (
                <SettingsSelect
                  key={index}
                  index={index}
                  {...{ settings, setSettings }}
                  {...rest}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </LayoutGroup>
  );
}
