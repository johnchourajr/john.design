import React, { Suspense } from "react";

import InlineLink from "@/components/InlineLink";
import { SettingsGroup } from "@/components/SettingsComponents";
import { SETTINGS, JohnGLCanvas } from "@/components/experimental/JohnGL";

export default function JohnGL() {
  const [settings, setSettings] = React.useState(SETTINGS);

  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <JohnGLCanvas settings={settings} />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
