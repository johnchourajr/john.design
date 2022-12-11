import React from "react";
import clsx from "clsx";
import { getSettingValue } from "../SettingsComponents";
import { TextContainer } from "./TextContainer";
import { useReducedMotion } from "framer-motion";

export function JustifiedHeadlineInner({
  headline,
  letters = false,
  iterations = 4,
  settings,
  ...rest
}: any) {
  const [ani, setAni] = React.useState(0);
  const speed = getSettingValue(settings, "Speed", 1000);
  const slant = getSettingValue(settings, "Add Slant", false);
  const animateLetters = getSettingValue(settings, "Letters", letters);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const interval = setInterval(() => {
      setAni((prev) => (prev + 1) % iterations);
    }, speed);
    return () => clearInterval(interval);
  }, [speed, iterations, reducedMotion]);

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
          <span
            key={index}
            className={clsx("tracking-normal uppercase text-[8vw]", className)}
          >
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
