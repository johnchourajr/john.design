'use client';

import React from 'react';

import { JohnGLCanvas, SETTINGS } from '@/components/experimental/JohnGL';
import { SettingsGroup } from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';

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
