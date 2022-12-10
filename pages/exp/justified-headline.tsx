import React from "react";
import InlineLink from "../../components/InlineLink";
import { SettingsGroup } from "../../components/SettingsComponents";
import { JustifiedHeadlineInner } from "../../components/justified-headline/JustifiedHeadlineInner";
import {
  TOP_LINE,
  LINE_ONE,
  LINE_TWO,
} from "../../components/justified-headline/data";

const SETTINGS = [
  {
    name: "Add Slant",
    type: "Boolean",
    value: false,
  },
  {
    name: "Letters",
    type: "Boolean",
    value: false,
  },
  {
    name: "Speed",
    type: "Slider",
    value: 1000,
    min: 500,
    max: 3000,
  },
];

export default function JustifiedHeadline() {
  const [settings, setSettings] = React.useState(SETTINGS);

  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8 font-sans">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <JustifiedHeadlineInner
        settings={settings}
        headline={[
          {
            text: "John Is",
            motionObject: TOP_LINE,
            className: "z-[100] relative",
          },
          { text: "Working On", motionObject: LINE_ONE },
          { text: "The Internet", motionObject: LINE_TWO },
        ]}
      />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
