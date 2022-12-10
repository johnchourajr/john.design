import React from "react";
import clsx from "clsx";
import { getSettingValue } from "../SettingsComponents";
import { TextContainer } from "./TextContainer";
import { LINE_ONE } from "./data";

export function JustifiedHeadlineInner({
  headline,
  letters = false,
  settings,
  ...rest
}: any) {
  const [ani, setAni] = React.useState(0);
  const speed = getSettingValue(settings, "Speed", 1000);
  const slant = getSettingValue(settings, "Add Slant", false);
  const animateLetters = getSettingValue(settings, "Letters", letters);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAni((prev) => (prev + 1) % LINE_ONE.length);
    }, speed);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <p
      className={clsx(
        "my-[10vw] leading-[1] w-full font-black pointer-events-none",
        slant && "!font-black-ritalic"
      )}
      data-id={ani}
      {...rest}
    >
      {headline.map(({ text, motionObject, className }: any, index: number) => {
        return (
          <span key={index} className={className}>
            <TextContainer
              key={index}
              text={text}
              motionObject={motionObject}
              motionKey={ani}
              letters={animateLetters}
            />
          </span>
        );
      })}
    </p>
  );
}
