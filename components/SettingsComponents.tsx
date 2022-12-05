import React from "react";
import { LayoutGroup, motion } from "framer-motion";
import clsx from "clsx";

export function getSettingValue(
  settings: any,
  name: string,
  fallback: string | boolean | number = true
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
    <div className="inline-flex flex-row items-center justify-center gap-3">
      {name}
      <button
        onClick={toggle}
        className={clsx(
          " flex p-1 rounded-full bg-[rgba(255,255,255,.2)] w-12",
          state.value ? " justify-end" : " justify-start"
        )}
      >
        <motion.div
          id={`toggle-${index}`}
          layout
          className={clsx(
            "w-5 h-5 rounded-full ",
            state.value ? "bg-[var(--root-color)]" : "bg-[#000000]"
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
    <div className="inline-flex flex-row items-center justify-center gap-3">
      {name}
      <input
        ref={slider}
        type="range"
        min={min}
        max={max}
        step={state.step || 1}
        value={state.value}
        onChange={update}
        className="w-32"
      />
      <span className="inline-flex flex-row whitespace-nowrap">
        {state.value}
        {state.unit}
      </span>
    </div>
  );
}
export function SettingsGroup({ settings, setSettings }: any) {
  return (
    <LayoutGroup>
      <div className="fixed bottom-4 left-4 flex gap-4 flex-col items-start justify-start w-fit">
        {settings.map(({ type, ...rest }: any, index: number) => {
          switch (type) {
            case "Boolean":
              return (
                <SettingsBoolean
                  key={index}
                  index={index}
                  {...{ settings, setSettings }}
                  {...rest}
                />
              );
            case "Slider":
              return (
                <SettingsSlider
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
